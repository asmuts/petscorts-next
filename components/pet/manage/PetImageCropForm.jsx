import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "react-toastify";

import { uploadImage } from "../../../services/imageUploadService";
import PetImageBaseForm from "./PetImageBaseForm";

// I discovered react-image-crop after having to figure out how
// to resize on a canvas, etc.  What a pain. I'm going to swap in
// the library. . . .
// https://github.com/DominicTobias/react-image-crop#example

// Increase pixel density for crop preview quality on retina screens.
//const pixelRatio = window.devicePixelRatio || 1;
const pixelRatio = 1;

// We resize the canvas down when saving on retina devices otherwise the image
// will be double or triple the preview size.
function getResizedCanvas(canvas, newWidth, newHeight) {
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = newWidth;
  tmpCanvas.height = newHeight;

  const ctx = tmpCanvas.getContext("2d");
  ctx.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    newWidth,
    newHeight
  );

  return tmpCanvas;
}

export default function PetImageCropForm({ pet, markDataStale, handleError }) {
  const [sourceImageFile, setSourceImageFile] = useState("");
  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
    aspect: 1 / 1,
  });
  const [completedCrop, setCompletedCrop] = useState(null);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSourceImageFile(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }, [completedCrop]);

  const getCanvasBlob = (canvas) => {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.9
      );
    });
  };

  // Send the file to the API --> S3, then tell the parent to update
  const submitForm = async (form) => {
    form.preventDefault();

    if (!completedCrop || !previewCanvasRef.current) {
      return;
    }
    // that's all we want from the html form
    const previewCanvas = previewCanvasRef.current;
    const canvas = getResizedCanvas(
      previewCanvas,
      completedCrop.width,
      completedCrop.height
    );
    var canvasBlob = await getCanvasBlob(canvas);

    const imageName = getImageName();
    const { imageUrl, err } = await uploadImage(canvasBlob, imageName, pet._id);
    if (imageUrl) {
      doPostSubmitCleanup(imageName);
    }
    if (err) {
      handleError(err);
    }
  };

  // Since I'm converting everything to jpg, I need to adjust the extension.
  const getImageName = () => {
    const full = sourceImageFile.name.toLowerCase();
    const name = full.substring(0, full.lastIndexOf(".")) + ".jpg";
    return name;
  };

  const doPostSubmitCleanup = (imageName) => {
    markDataStale();
    toast(`Image (${imageName}) added.`);
    setSourceImageFile();
    setUpImg();
    setCompletedCrop(null);
  };

  ///////////////////////////////////////////////////////////////////
  return (
    <div className="App">
      <p className="page-title">Add an image</p>

      <PetImageBaseForm
        image={upImg}
        result={completedCrop}
        onSelectFile={onSelectFile}
        submitForm={submitForm}
      ></PetImageBaseForm>

      <ReactCrop
        src={upImg}
        onImageLoaded={onLoad}
        crop={crop}
        onChange={(c) => setCrop(c)}
        onComplete={(c) => setCompletedCrop(c)}
      />

      <div>
        <canvas
          ref={previewCanvasRef}
          // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
          style={{
            width: Math.round(completedCrop?.width ?? 0),
            height: Math.round(completedCrop?.height ?? 0),
          }}
        />
      </div>
    </div>
  );
}

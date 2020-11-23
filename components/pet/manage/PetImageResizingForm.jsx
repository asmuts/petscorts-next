import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";

// TODO convert everything to R-B
import { Container } from "react-bootstrap";
import { uploadImage } from "../../../services/imageUploadService";
import PetImageBaseForm from "./PetImageBaseForm";

// I want to be able to add multipe images
// each should be displayed
// the user should be able to delete them
// later, add the ability to hide images
// and to make one primary for the search results card
// phase 1: just add and display.
export default function PetImageResizingForm({
  pet,
  markDataStale,
  handleError,
}) {
  const [image, setImage] = useState("");
  const [result, setResult] = useState("");

  // TODO make configurable
  var MAX_WIDTH = 800;
  var MAX_HEIGHT = 600;

  const previewCanvasRef = useRef(null);
  let canvas;

  useEffect(() => {
    if (canvas) return;
    canvas = previewCanvasRef.current;
  });

  const clearImage = () => {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    setResult("");
  };

  // Display the selected image on a canvas and resize
  // Apply browser codec to get a slightly compressed jpeg
  // Setup the canvas to be used by doSubmit
  const preview = async (e) => {
    clearImage();
    //setMessage("");

    const file = e.target.files[0];
    if (!file) {
      //setMessage("");
      return;
    }
    if (!file.type.match(/image.*/)) {
      toast("The selected file is not an image.");
      return;
    }

    const contents = await getFileContents(file);
    setResult(contents);
    const img = await loadImage(contents);
    img.src = contents;

    resizeOnCanvas(img);
  };

  // need to await the data, else it can't be painted to the canvas
  const loadImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (err) => reject(err));
      img.src = url;
    });

  // I mmight be able to scrap this now that
  // I'm waiting on the image loading. Test and see.
  // There were so many concurrency issues. . . .
  const getFileContents = (file) => {
    return new Promise((resolve, reject) => {
      let contents = "";
      const reader = new FileReader();
      reader.onload = function (e) {
        contents = e.target.result;
        resolve(contents);
      };
      reader.onerror = function (e) {
        reject(e);
      };
      reader.readAsDataURL(file);
    });
  };

  // Simple shrinking of the image size
  const resizeOnCanvas = (img) => {
    var width = img.width;
    var height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    ctx.fill(); // not sure this is needed still
  };

  // TODO, I might want to programatically adjust the compression
  // Gets a blog from the canvas and turns it into a jpeg
  const getCanvasBlob = (canv) => {
    return new Promise(function (resolve, reject) {
      canv.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.9
      );
    });
  };

  // Since I'm converting everything to jpg, I need to adjust the extension.
  const getImageName = () => {
    const full = image.name.toLowerCase();
    const name = full.substring(0, full.lastIndexOf(".")) + ".jpg";
    return name;
  };

  const doPostSubmitCleanup = () => {
    markDataStale();
    clearImage();
    setImage("");
    toast(`Image (${image.name}) added.`);
  };

  // Send the file to the API --> S3, then tell the parent to update
  const submitForm = async (form) => {
    form.preventDefault();
    // that's all we want from the html form
    var canvasBlob = await getCanvasBlob(canvas);

    const { imageUrl, err } = await uploadImage(
      canvasBlob,
      getImageName(),
      pet._id
    );
    if (imageUrl) {
      doPostSubmitCleanup();
    }
    if (err) {
      //toast("Trouble saving image. Please try again.");
      handleError(err);
      //setShowToast(true);
    }
  };

  const onSelectFile = (e) => {
    setImage(e.target.files[0]);
    preview(e);
  };

  ///////////////////////////////////////////////////////////////////////
  return (
    <div className="App">
      <p className="page-title">Add an image</p>

      <PetImageBaseForm
        image={image}
        result={result}
        onSelectFile={onSelectFile}
        submitForm={submitForm}
      ></PetImageBaseForm>

      <div className="row">
        <div className="col-md-6 col-xs-6">
          <Container className="mx-auto">
            <canvas ref={previewCanvasRef} height="400"></canvas>
          </Container>
        </div>
      </div>
    </div>
  );
}

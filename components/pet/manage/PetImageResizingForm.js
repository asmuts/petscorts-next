import React, { useRef, useEffect, useState } from "react";
// TODO convert everything to R-B
import { Form, Button, Col, Row, Toast, Container } from "react-bootstrap";
import axios from "axios";

// I want to be able to add multipe images
// each should be displayed
// the user should be able to delete them
// later, add the ability to hide images
// and to make one primary for the search results card
// phase 1: just add and display.
export default function PetImageResizingForm({ pet, markDataStale }) {
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [showToast, setShowToast] = useState(false);

  // TODO make configurable
  var MAX_WIDTH = 800;
  var MAX_HEIGHT = 600;

  const canvasRef = useRef(null);
  let canvas;

  useEffect(() => {
    if (canvas) return;
    canvas = canvasRef.current;
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
    setMessage("");

    const file = e.target.files[0];
    if (!file) {
      setMessage("");
      return;
    }
    if (!file.type.match(/image.*/)) {
      setMessage("The selected file is not an image.");
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

  // Multer s3 can't handle the dataUrl.  I need a form
  const makeFormToSubmit = async () => {
    var canvasBlob = await getCanvasBlob(canvas);
    let imageFile = new File([canvasBlob], getImageName(), {
      type: image.type,
    });
    console.log("imageFile size " + imageFile.size);

    // make a new form to submit
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("petId", pet._id);
    return formData;
  };

  const doPostSubmitCleanup = () => {
    markDataStale();
    clearImage();
    setImage("");
    setMessage(`Image (${image.name}) added.`);
    setShowToast(true);
  };

  // Send the file to the API --> S3, then tell the parent to update
  const submitForm = async (form) => {
    form.preventDefault();
    // that's all we want from the html form

    const formData = await makeFormToSubmit();

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        enctype: "multipart/form-data",
      },
    };

    const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
    const apiURL = `${baseURL}/api/v1/upload`;
    try {
      const res = await axios.post(apiURL, formData, config);
      if (res.status === 200) {
        let imageUrl = res.data;
        console.log(`Added image ${imageUrl} for pet. ${pet._id}`);
        doPostSubmitCleanup();
      }
    } catch (e) {
      console.log(e, `Error calling ${apiURL}`);
      setMessage("Trouble saving image. Please try again.");
      setShowToast(true);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  return (
    <div className="App">
      <p className="page-title">Add an image</p>

      <div className="row">
        <div className="col-md-12 col-xs-6">
          <Form onSubmit={(form) => submitForm(form)}>
            <Form.Row>
              <Form.Group as={Col} md="9">
                <Form.File custom>
                  <Form.File.Input
                    key={image}
                    className="rounded-pill"
                    isValid
                    accept="image/*"
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                      preview(e);
                    }}
                  />
                  <Form.File.Label data-browse="Find">
                    {image ? image.name : "Select an image to upload"}
                  </Form.File.Label>
                </Form.File>
              </Form.Group>
              <Form.Group as={Col} md="3">
                {result && (
                  <Button
                    className="rounded"
                    type="submit"
                    variant="primary"
                    size="sm"
                    onClick={() => {}}
                  >
                    Sumbit
                  </Button>
                )}
              </Form.Group>
            </Form.Row>
          </Form>
        </div>
      </div>

      <div className="row">
        <Col xs={6}>
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded mr-2"
                alt=""
              />
              <strong className="mr-auto"> </strong>
            </Toast.Header>
            <Toast.Body>{message}</Toast.Body>
          </Toast>
        </Col>
      </div>
      <div className="row">
        <div className="col-md-6 col-xs-6">
          <Container className="mx-auto">
            <canvas ref={canvasRef} height="400"></canvas>
          </Container>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Form, Button, Col, Container } from "react-bootstrap";
import axios from "axios";

// I want to be able to add multipe images
// each should be displayed
// the user should be able to delete them
// later, add the ability to hide images
// and to make one primary for the search results card
// phase 1: just add and display.
export default function PetImageForm({ pet, markDataStale }) {
  const [image, setImage] = React.useState("");

  // Custom hook
  function useDisplayImage() {
    const [result, setResult] = React.useState("");

    function clearImage() {
      setResult("");
    }

    function uploader(e) {
      const imageFile = e.target.files[0];

      const reader = new FileReader();
      reader.addEventListener("load", (e) => {
        setResult(e.target.result);
      });
      // TODO make sure there is a filename
      if (imageFile) {
        reader.readAsDataURL(imageFile);
      }
    }
    return { result, uploader, clearImage };
  }
  const { result, uploader, clearImage } = useDisplayImage();

  // Send the file to the API --> S3, then tell the parent to update
  const submitForm = async (form) => {
    form.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("petId", pet._id);

    const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
    const apiURL = `${baseURL}/api/v1/upload`;

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    try {
      const res = await axios.post(apiURL, formData, config);
      if (res.status === 200) {
        let imageUrl = res.data;
        console.log(`Added image ${imageUrl} for pet. ${pet._id}`);
        markDataStale();
        clearImage();
      }
      // TODO handle error
    } catch (e) {
      console.log(e, `Error calling ${apiURL}`);
      alert("There was a problem saving the image. Please try again.");
    }
  };

  ///////////////////////////////////////////////////////////////////////
  return (
    <div className="App">
      <p className="page-title">Add an image</p>

      <div className="row">
        <div className="col-md-6 col-xs-6">
          <Form onSubmit={(form) => submitForm(form)}>
            <Form.Row>
              <Form.Group as={Col} md="9">
                <Form.File custom>
                  <Form.File.Input
                    className="rounded-pill"
                    isValid
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                      uploader(e);
                    }}
                  />
                  <Form.File.Label data-browse="Find">
                    Select an image
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
        <div className="col-md-6 col-xs-6">
          <Container className="mx-auto">
            {result && <img className="w-100" src={result} alt="" />}
          </Container>
        </div>
      </div>
    </div>
  );
}

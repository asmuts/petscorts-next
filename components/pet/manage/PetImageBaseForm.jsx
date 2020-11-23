import { Form, Button, Col, Row, Toast, Container } from "react-bootstrap";

export default function PetImageBaseForm({
  image,
  result,
  submitForm,
  onSelectFile,
}) {
  return (
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
                  onChange={onSelectFile}
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
  );
}

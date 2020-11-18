import { Formik } from "formik";
import * as yup from "yup";
import { Form, Button, Col, InputGroup } from "react-bootstrap";

const PetDetailForm = ({ doSubmit, doCancel, initialValues }) => {
  const schema = yup.object({
    name: yup.string().required(),
    dailyRentalRate: yup.number().required().min(1),
    city: yup.string().required(),
    state: yup.string().required().min(2).max(2),
    street: yup.string().required().min(6),
    description: yup.string().required().min(10),
    species: yup.string().required(),
    breed: yup.string().required(),
  });

  // TODO pull from database
  const speciesOptions = ["dog", "cat", "rat", "chimp", "duck"];

  return (
    <>
      <Formik
        validationSchema={schema}
        onSubmit={doSubmit}
        initialValues={initialValues}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          isValid,
          errors,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="validationFormik01">
                <Form.Label>Pet name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  isValid={touched.name && !errors.name}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="validationFormik02">
                <Form.Label>Daily Rate</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="text"
                    name="dailyRentalRate"
                    value={values.dailyRentalRate}
                    onChange={handleChange}
                    isInvalid={!!errors.dailyRentalRate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dailyRentalRate}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md="6" controlId="validationFormik05">
                <Form.Label>Street</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Sreet"
                  name="street"
                  value={values.street}
                  onChange={handleChange}
                  isInvalid={!!errors.street}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.street}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="3" controlId="validationFormik03">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  isInvalid={!!errors.city}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.city}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationFormik04">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="State"
                  name="state"
                  value={values.state}
                  onChange={handleChange}
                  isInvalid={!!errors.state}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.state}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md="6" controlId="validationFormik06">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter a description"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="3" controlId="validationFormik07">
                <Form.Label>Species</Form.Label>
                <Form.Control
                  as="select"
                  name="species"
                  onChange={handleChange}
                  value={values.species}
                  defaultValue={values.species}
                  isInvalid={!!errors.species}
                >
                  {/* <option key={values.species} value={values.species}>
                    {values.species}
                  </option> */}

                  {speciesOptions.map((s) => {
                    //if (s === values.species) return;
                    return (
                      <option
                        key={s}
                        value={s}
                        //selected={s === values.species ? true : false}
                      >
                        {s}
                      </option>
                    );
                  })}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.species}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="3" controlId="validationFormik08">
                <Form.Label>Breed</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Mut"
                  name="breed"
                  value={values.breed}
                  onChange={handleChange}
                  isInvalid={!!errors.breed}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.breed}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <Button type="submit" className="rounded" size="sm">
              Submit
            </Button>
            <Button
              variant="secondary"
              className="ml-2 rounded"
              size="sm"
              onClick={doCancel}
            >
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default PetDetailForm;

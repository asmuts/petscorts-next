import { useRouter } from "next/router";
import { Col, Container, Row, Card, Button, Image } from "react-bootstrap";
//import { toast } from "react-toastify";

const createErrorMessage = (error) => {
  if (error.includes("422")) {
    return "Sorry. The requested dates are no longer available.";
  }
};

const routeToPetDetail = (petId) => {
  const query = {};
  const url = { pathname: `/pet/${petId}`, query };
  const asUrl = { pathname: `/pet/${petId}`, query };
  router.push(url, asUrl);
};

const bgimage = "/images/sad-dog-error.jpg";

const BookingError = ({ error, petId }) => {
  console.log(error);
  return (
    <>
      <Row>
        <Image src={bgimage} fluid />
      </Row>
      <Row>
        <h4>{createErrorMessage(error)}</h4>
      </Row>
      <Row>
        <Button onClick={() => routeToPetDetail(petId)} variant="primary">
          Return to Pet Detail
        </Button>
      </Row>
    </>
  );
};

export default BookingError;

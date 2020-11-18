import { Card, Col, Image, Container, Row } from "react-bootstrap";

const UserDetails = ({ user }) => {
  return (
    <Row>
      <Col md="3">
        <Image fluid src={user.picture} alt={user.name}></Image>
      </Col>
      <Col md="6">
        <Card className="text-center">
          <Card.Header>{user.name}</Card.Header>
          <Card.Body>
            <Card.Text>{user.email}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted"></small>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
};

export default UserDetails;

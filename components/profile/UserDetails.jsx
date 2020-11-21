import { Card, Col, Image, Container, Row } from "react-bootstrap";

const UserDetails = ({ user }) => {
  return (
    <Row>
      <Col md="4">
        <Card className="user-image">
          <Card.Body>
            <Image fluid src={user.picture} alt={user.name}></Image>
          </Card.Body>
        </Card>
      </Col>
      <Col md="8">
        <Card className="text-center">
          <Card.Header as="h5">{user.name}</Card.Header>
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

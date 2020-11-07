import { useRouter } from "next/router";
import Layout from "../components/shared/Layout.js";
import { useFetchUser } from "../util/user";
import { Card, Col, Image, Container, Row } from "react-bootstrap";

export default function Profile() {
  const { user, loading } = useFetchUser();
  const router = useRouter();

  if (loading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  if (!user && !loading) {
    router.replace("/api/auth/login");
  }

  const handleListPet = () => {
    push({}, "/manage/owner");
  };
  const push = (query, path) => {
    const url = { pathname: path, query };
    const asUrl = { pathname: path, query };
    router.push(url, asUrl);
  };

  return (
    <Layout>
      <section id="userDetail">
        <Container fluid className="main-container">
          <Row>
            <p className="page-title">Welcome {user.name}</p>
          </Row>
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
          {/* {JSON.stringify(user)} */}
          (this page is a placeholder)
          <p />
          <a onClick={handleListPet} href="#">
            Manage Your Pets
          </a>
        </Container>
      </section>
    </Layout>
  );
}

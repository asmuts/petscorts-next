import Layout from "../../components/shared/Layout.js";
import OwnerPetDeck from "../../components/pet/manage/OwnerPetDeck.js";
import { useFetchUser } from "../../util/user";
import { Card, Col, Image, Container, Row, Button } from "react-bootstrap";

import { useRouter } from "next/router";
import axios from "axios";
import React, { useState, useEffect } from "react";

export default function Owner() {
  const { user, loading } = useFetchUser();
  let [owner, setOwner] = useState(null);
  let [isNewOwner, setIsNewOwner] = useState(false);

  useEffect(() => {
    // 1.See if we have an owner for the email address.
    // 2. If not, create one.  The API should probably do this.
    // I don't know a good way to determine if the user just signed up or not
    // from the auth0 response.
    // 3. Get pets for owner.
    async function fetchData() {
      if (user && !loading) {
        let foundOwner = await getOwnerForEmail(user.email);
        if (!foundOwner || !foundOwner._id) {
          await createOwner(user);
          setIsNewOwner(true);
        }
      }
    }
    fetchData();
  }, [user]);

  async function getOwnerForEmail(email) {
    let foundOwner;
    console.log("Looking for user with email [" + user.email + "]");
    const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;

    // make sure scopes in the config includes email
    let ownerApiRoute = `/api/v1/owners/email/${user.email}`;
    const ownerURL = baseURL + ownerApiRoute;
    try {
      const res = await axios.get(ownerURL);
      console.log(res.status);
      if (res.status === 200) {
        console.log("Found owner data: " + res.data);
        foundOwner = res.data;
        setOwner(foundOwner);
      }
    } catch (e) {
      console.log(e, `Error calling ${ownerURL}`);
      //TODO handle error
    }
    return foundOwner;
  }

  async function createOwner(user) {
    let ownerNew = {
      username: user.nickname,
      fullname: user.name,
      email: user.email,
    };
    const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
    let ownerApiRoute = `/api/v1/owners/`;
    const ownerURL = baseURL + ownerApiRoute;
    try {
      const resOwner = await axios.post(ownerURL, ownerNew);
      console.log("Owner data: " + resOwner.data);
      // I might just get the id back
      if (resOwner.data) {
        ownerNew._id = resOwner.data.ownerId;
        setOwner(ownerNew);
      }
    } catch (e) {
      console.log(e, `Error creating owner ${ownerURL}`);
      //TODO handle error
    }
  }

  const router = useRouter();
  const routeToPetManageForm = (ownerId) => {
    const query = { ownerId: ownerId };
    const url = { pathname: "/pet/editPet", query };
    const asUrl = { pathname: "/pet/editPet", query };
    router.push(url, asUrl);
  };

  /////////////////////////////////////////////////////////////////////
  if (loading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }
  if (!user && !loading) {
    Router.replace("/");
  }

  return (
    <Layout>
      <section id="ownerDetail">
        <Container fluid className="main-container">
          <Row>
            <h2>Manage Your Pets</h2>
          </Row>
          <Row>{isNewOwner && <h2>Thanks for signing up!</h2>}</Row>
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

          {owner && (
            <>
              <Row>
                <p hidden>{owner._id}</p>
              </Row>
              <hr />
              <Row>
                <Button
                  variant="outline-primary rounded-pill"
                  onClick={() => routeToPetManageForm(owner._id)}
                >
                  Add a pet
                </Button>
              </Row>
            </>
          )}
          <hr />
          <OwnerPetDeck owner={owner}></OwnerPetDeck>
          <p hidden>{JSON.stringify(user)}</p>
        </Container>
      </section>
    </Layout>
  );
}

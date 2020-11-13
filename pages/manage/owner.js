import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Card, Col, Image, Container, Row, Button } from "react-bootstrap";

import Layout from "../../components/shared/Layout.js";
import OwnerPetDeck from "../../components/pet/manage/OwnerPetDeck.js";
import { useFetchUser } from "../../util/user";
import http from "../../services/authHttpService";

export default function Owner() {
  const { user, loading } = useFetchUser();
  let [owner, setOwner] = useState(null);
  let [isNewOwner, setIsNewOwner] = useState(false);

  useEffect(() => {
    // 1.See if we have an owner for the email address.
    // NOTE: need to use Auth0Sub, not email
    // -- unless verified, a user can be spoofed by email
    // -- email is unique here, so it can be used subsequently
    // 2. If not, create one.  The API should probably do this.
    // I don't know a good way to determine if the user just signed up or not
    // from the auth0 response.
    // 3. Get pets for owner.
    async function fetchData() {
      if (user && !loading) {
        let foundOwner = await getOwnerForAuth0Sub(user.sub);
        if (!foundOwner || !foundOwner._id) {
          // make sure they don't have an account under the same email
          // using a different auth0 sub!!
          //let foundOwnerForEmail = await getOwnerForEmail(user.email);
          // TODO!! if we have them for email, warn! and stop
          await createOwner(user);
          setIsNewOwner(true);
        }
      }
    }
    fetchData();
  }, [user]);

  // move to SWR
  async function getOwnerForAuth0Sub(auth0_sub) {
    let foundOwner;
    console.log("Looking for user with auth0_sub [" + auth0_sub + "]");
    const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;

    // make sure scopes in the config includes email
    let ownerApiRoute = `/api/v1/owners/auth0_sub/${auth0_sub}`;
    const ownerURL = baseURL + ownerApiRoute;
    try {
      const res = await http.get(ownerURL);
      //console.log(res.status);
      if (res.status === 200) {
        console.log("Found owner data: " + res.data.data);
        //console.log(res.data.data);
        // TODO handle error
        foundOwner = res.data.data;
        setOwner(foundOwner);
      }
    } catch (e) {
      console.log(e, `Error calling ${ownerURL}`);
      //TODO handle error
    }
    return foundOwner;
  }

  // There's a chance given auth0 that the owner could
  // exist under another sub with the same email.
  // That won't work. Email is unique here.
  // The user has probably mistakenly used a different sub
  // Notify the user that they've logged in differently before.
  // And don't create a new Onwer.
  async function getOwnerForEmail(email) {
    let foundOwner;
    console.log("Looking for user with email [" + email + "]");
    const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;

    // make sure scopes in the config includes email
    let ownerApiRoute = `/api/v1/owners/email/${email}`;
    const ownerURL = baseURL + ownerApiRoute;
    try {
      const res = await http.get(ownerURL);
      //console.log(res.status);
      if (res.status === 200) {
        //console.log("Found owner data: " + res.data);
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
      auth0_sub: user.sub,
    };
    const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
    let ownerApiRoute = `/api/v1/owners/`;
    const ownerURL = baseURL + ownerApiRoute;
    try {
      const resOwner = await http.post(ownerURL, ownerNew);
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
    const url = { pathname: "/pet/managePet", query };
    const asUrl = { pathname: "/pet/managePet", query };
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

  // Not authorized. TODO message user
  if ((!user && !loading) || !user.email) {
    return router.replace("/api/auth/login");
  }

  return (
    <Layout>
      <section id="ownerDetail">
        <Container fluid className="main-container">
          <Row>
            <p className="page-title">Manage Your Pets</p>
          </Row>
          <Row>{isNewOwner && <h2>Thanks for signing up!</h2>}</Row>
          <Row>
            <Col md="3">
              <Card className="user-image">
                <Card.Body>
                  <Image fluid src={user.picture} alt={user.name}></Image>
                </Card.Body>
              </Card>
            </Col>
            <Col md="6">
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

          {owner && (
            <>
              <Row>
                <p hidden>{owner._id}</p>
              </Row>
              <hr />
              <Row>
                <Col md="3">
                  <Button
                    variant="outline-primary rounded-pill"
                    onClick={() => routeToPetManageForm(owner._id)}
                  >
                    Add a pet
                  </Button>
                </Col>
              </Row>
            </>
          )}
          <hr />
          <Row>
            <Col>
              <OwnerPetDeck owner={owner}></OwnerPetDeck>
              <p hidden>{JSON.stringify(user)}</p>
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
}

////////////////////////////////////////////////////////////////////

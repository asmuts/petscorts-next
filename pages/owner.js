import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ScrollToTop from "react-scroll-to-top";
import { toast } from "react-toastify";

import Layout from "../components/shared/Layout";
import OwnerPetDeck from "../components/pet/manage/OwnerPetDeck";
import OwnerDetail from "../components/pet/manage/OwnerDetail";
import AddPetButton from "../components/pet/manage/AddPetButton";
import { useFetchUser } from "../util/user";
//import useUserData from "../hooks/useUserData";
import { getOwnerForEmail, createOwner } from "../services/ownerService";
import OwnerBookings from "../components/owner/OwnerBookings";
import {
  useOwnerForAuth0Sub,
  mutateOwnerForAuth0Sub,
} from "../hooks/useOwnerData";

export default function Owner() {
  const { user, loading: isUserLoading, isError: isUserError } = useFetchUser();
  //const { user, isLoading: isUserLoading, isError: isUserError, } = useUserData();
  //
  const {
    owner,
    isLoading: isOwnerLoading,
    isError: isOwnerError,
  } = useOwnerForAuth0Sub(user);

  if (isOwnerError) {
    handleError(isOwnerError.message);
  }

  let [isNewOwner, setIsNewOwner] = useState(false);
  let [mustReAuthenticate, setMustReAuthenticate] = useState(false);
  let [error, setError] = useState();

  // Create a new owner if we don't have one for the auth0 sub.
  useEffect(() => {
    console.log("useEffect");
    async function fetchData() {
      if (user) {
        // TODO handle owner load error
        if (!owner && !isOwnerLoading && !error) {
          let { owner: foundOwner, err: errOwner } = await getOwnerForEmail(
            user.email
          );
          if (!foundOwner) {
            console.log("Creating new owner");
            let { owner: newOwner, err: errCreate } = await createOwner(user);
            // TODO handle error
            //owner = newOwner;
            setIsNewOwner(true);
            mutateOwnerForAuth0Sub(user.sub, newOwner);
          } else {
            console.log("Found owner for email.");
            setError(
              "It looks like you've already registered using a different source. Please logout and try again."
            );
            // This is ugly. One more reason not to use Auth0.
          }
        }
        console.log("Owner. isOwnerLoading " + isOwnerLoading);
        console.log(owner);
        console.log("Owner. isOwnerError [" + isOwnerError + "]");
      }
    }
    fetchData();
  });

  const router = useRouter();

  // TODO make this common funcationality re-usable
  function handleError(err) {
    console.log("Profile. handleError: " + err);
    if ((err + "").includes("404")) {
      // ignore, the user hasn't booked or listed any pets
      return;
    }
    console.log(err);
    if ((err + "").includes("AccessTokenError") || (err + "").includes("401")) {
      setMustReAuthenticate(true);
    }
    setError(err);
    toast(err);
  }

  /////////////////////////////////////////////////////////////////////
  if ((!user && !isUserLoading) || isUserError || mustReAuthenticate) {
    router.replace("/api/auth/login");
    // return something, else a nothing returned from render error will splash
    return "";
  }

  if (isUserLoading || isOwnerLoading) {
    return (
      <Layout>
        <p>Loading your data...</p>
      </Layout>
    );
  }

  ////////////////////////
  return (
    <Layout>
      <section id="ownerDetail">
        <Container fluid className="main-container">
          <Row>
            <p className="page-title">Manage Your Pets</p>
          </Row>
          <Row>{isNewOwner && <h2>Thanks for signing up!</h2>}</Row>
          <OwnerDetail user={user}></OwnerDetail>

          <Row>
            <p hidden>{owner._id}</p>
          </Row>

          <hr />
          {owner && owner._id && (
            <>
              <Row>
                <Col md="3">
                  <AddPetButton ownerId={owner._id}></AddPetButton>
                </Col>
              </Row>
              <hr />
            </>
          )}

          {owner && (
            <section id="ownerPets">
              <Row>
                <Col>
                  <OwnerPetDeck handleError={handleError}></OwnerPetDeck>
                  <p hidden>{JSON.stringify(user)}</p>
                </Col>
              </Row>
            </section>
          )}
          <hr />

          {owner && (
            <section id="ownerBookings">
              {" "}
              <Row>
                <Col>
                  <OwnerBookings
                    ownerId={owner._id}
                    handleError={handleError}
                  ></OwnerBookings>
                </Col>
              </Row>
            </section>
          )}
        </Container>
      </section>
      <ScrollToTop smooth />
    </Layout>
  );
}

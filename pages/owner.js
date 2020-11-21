import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ScrollToTop from "react-scroll-to-top";
import { toast } from "react-toastify";

import Layout from "../components/shared/Layout";
import OwnerPetDeck from "../components/pet/manage/OwnerPetDeck";
import OwnerDetail from "../components/pet/manage/OwnerDetail";
import AddPetButton from "../components/pet/manage/AddPetButton";
//import { useFetchUser } from "../../util/user";
import useUserData from "../hooks/useUserData";
import { getOwnerForEmail, createOwner } from "../services/ownerService";
import OwnerBookings from "../components/owner/OwnerBookings";
import {
  useOwnerForAuth0Sub,
  mutateOwnerForAuth0Sub,
} from "../hooks/useOwnerData";

export default function Owner() {
  //const { user, loading } = useFetchUser();
  const {
    user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useUserData();
  const {
    owner,
    mutate,
    isLoading: isOwnerLoading,
    isError: isErrorOwner,
  } = useOwnerForAuth0Sub(user);

  let [isNewOwner, setIsNewOwner] = useState(false);
  let [mustReAuthenticate, setMustReAuthenticate] = useState(false);
  let [error, setError] = useState();

  // Create a new owner if we don't have one for the auth0 sub.
  useEffect(() => {
    async function fetchData() {
      if (user) {
        if (!owner && !isOwnerLoading) {
          let { owner: foundOwner, err: errOwner } = await getOwnerForEmail(
            user.email
          );
          if (!foundOwner) {
            console.log("Creationg new owner");
            let { owner: isNewOwner, err: errCreate } = await createOwner(user);
            setIsNewOwner(true);
            mutateOwnerForAuth0Sub(user.sub);
            mutate();
          } else {
            console.log("Found user for email.");
            // TODO message the user that they probably authenticated
            // through a different sub.
          }
        }
      }
    }
    fetchData();
  }, [user]);

  const router = useRouter();

  function handleError(err) {
    console.log("Profile. handleError: " + err);
    console.log(err);
    if ((err + "").includes("404")) {
      // ignore, the user hasn't booked or listed any pets
      return;
    }
    if ((err + "").includes("AccessTokenError") || (err + "").includes("401")) {
      // TODOimplement
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
          {owner && !isOwnerLoading && (
            <>
              <Row>
                <p hidden>{owner._id}</p>
              </Row>
              <hr />
              <Row>
                <Col md="3">
                  <AddPetButton ownerId={owner._id}></AddPetButton>
                </Col>
              </Row>
              <hr />
            </>
          )}
          <section id="ownerPets">
            <Row>
              <Col>
                <OwnerPetDeck handleError={handleError}></OwnerPetDeck>
                <p hidden>{JSON.stringify(user)}</p>
              </Col>
            </Row>
          </section>
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

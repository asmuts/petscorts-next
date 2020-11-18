import { useRouter } from "next/router";
import Layout from "../components/shared/Layout";
import React, { useState, useEffect } from "react";
import { useFetchUser } from "../util/user";
import { Card, Col, Image, Container, Row } from "react-bootstrap";
//import useUserData from "../hooks/useUserData";
import { useOwnerForAuth0Sub } from "../hooks/useOwnerData";
import { useRenterForAuth0Sub } from "../hooks/useRenterData";
import RenterBookings from "./../components/profile/RenterBookings";
import UserDetails from "./../components/profile/UserDetails";

export default function Profile() {
  const router = useRouter();

  let [mustReAuthenticate, setMustReAuthenticate] = useState(false);
  let [error, setError] = useState();

  const { user, loading: isUserLoading } = useFetchUser();
  //const { user, isLoading: isUserLoading } = useUserData();

  const {
    owner,
    isLoading: isOwnerLoading,
    isError: isOwnerError,
  } = useOwnerForAuth0Sub(user);

  if (isOwnerError) {
    handleError(isOwnerError);
  }

  const {
    renter,
    isLoading: isRenterLoading,
    isError: isErrorRenter,
  } = useRenterForAuth0Sub(user);

  /////////////////////////////

  const handleListPet = () => {
    push({}, "/owner");
  };
  const push = (query, path) => {
    const url = { pathname: path, query };
    const asUrl = { pathname: path, query };
    router.push(url, asUrl);
  };

  function handleError(err) {
    console.log("Profile. handleError: " + err);
    if (err.includes("AccessTokenError") || err.includes("401")) {
      setMustReAuthenticate(true);
    }
    setError(err);
  }

  ////////////////////////////

  if (!user && !isUserLoading) {
    router.replace("/api/auth/login");
    return "";
  }

  //Not authorized. TODO message user
  if (mustReAuthenticate) {
    router.replace("/api/auth/login");
    // return something, else a nothing returned from render error will splash
    return "";
  }

  if (isUserLoading || isRenterLoading || isOwnerLoading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  ////////////////////////////////////////////////////
  // display bookings for renter
  // not sure what I want to display if there is ownerdata
  // probably just a link

  return (
    <Layout>
      <section id="userDetail">
        <Container fluid className="main-container">
          <Row>
            <p className="page-title">Welcome {user.name}</p>
          </Row>
          <UserDetails user={user}></UserDetails>

          {/* UPCOMING BOOKINGS click to show older bookings. */}
          <RenterBookings renterId={renter._id}></RenterBookings>
          <p />
          <a onClick={handleListPet} href="#">
            Manage Your Pets
          </a>
        </Container>
      </section>
    </Layout>
  );
}

import { useRouter } from "next/router";
import Layout from "../components/shared/Layout";
import React, { useState } from "react";
import { useFetchUser } from "../util/user";
import { Col, Image, Container, Row } from "react-bootstrap";
import ScrollToTop from "react-scroll-to-top";

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

  // TODO SWR will keep retrying on failue.
  // Ether configure it differently or just use a service for the data
  // and do the lookups in useEffect
  const {
    owner,
    isLoading: isOwnerLoading,
    isError: isOwnerError,
  } = useOwnerForAuth0Sub(user);

  if (isOwnerError) {
    handleError(isOwnerError.message);
  }

  const {
    renter,
    isLoading: isRenterLoading,
    isError: isErrorRenter,
  } = useRenterForAuth0Sub(user);

  if (isErrorRenter) {
    handleError(isErrorRenter.message);
  }

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
    console.log(err);
    if (err.includes("404")) {
      // ignore, the user hasn't booked or listed any pets
      return;
    }
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

  // The user might not have a renter record or an owner record
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
      <section id="profilePage">
        <Container fluid className="main-container">
          <Row>
            <p className="page-title">Welcome {user.name}</p>
          </Row>
          <UserDetails user={user}></UserDetails>

          {/* UPCOMING BOOKINGS click to show older bookings. */}
          <hr className="mb-2" />
          <Row>
            <Col>
              {" "}
              {renter && (
                <>
                  <RenterBookings renterId={renter._id}></RenterBookings>
                </>
              )}
              {!renter && (
                <p className="page-title">You haven't booked any pets.</p>
              )}
            </Col>
          </Row>

          <Row>
            <Col>
              <hr className="mb-2" />{" "}
              {!owner && (
                <>
                  <p className="page-title">
                    You haven't listed any pets for rent.
                  </p>
                  <hr className="mb-2" />
                  <a onClick={handleListPet} href="#">
                    List Your Pets
                  </a>
                </>
              )}
              {owner && (
                <a onClick={handleListPet} href="#">
                  Manage Your Pets
                </a>
              )}
            </Col>
          </Row>
        </Container>
      </section>
      <ScrollToTop smooth />
    </Layout>
  );
}

import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { Col, Container, Row, Card, Button, Image } from "react-bootstrap";
import { toast } from "react-toastify";

import Layout from "../components/shared/Layout.js";
//import useUserData from "../hooks/useUserData";
import { useFetchUser } from "../util/user";
import { createBooking } from "../hooks/bookingService";
import { getPet, updatePet } from "../hooks/petService";
import { getDatesInRange } from "../util/date-util";
import {
  routeToRenterLogin,
  routeToProfile,
  routeToPetDetail,
} from "../util/routing-util";
import BookingModal from "../components/book/BookingModal";
import BookingError from "../components/book/BookingError";
import { getRenterForEmail, createRenter } from "../hooks/renterService";
import { useRenterForAuth0Sub } from "../hooks/useRenterData";
/*
  If users are not logged in are directed.
  After login or signup they are redirected back here.

  Load the user and pet data.
  Present the details.
  All the user to edit dates (TODO)

  Present a model to confirm and enter payment info.
  Store the payment info from Stripe and ask for a final confirmation.
  Create the booking record (TODO).

  Redirect to profile page which should list the bookings.
*/
const Book = () => {
  const router = useRouter();

  const query = router.query;
  let petId = query.petId;
  let startAt = query.startAt;
  let endAt = query.endAt;

  let [mustReAuthenticate, setMustReAuthenticate] = useState(false);
  let [pet, setPet] = useState();
  let [error, setError] = useState();
  let [modalOpen, setModalOpen] = useState(false);
  let [proposedBooking, setProposedBooking] = useState({
    proposedBooking: {
      startAt: "",
      endAt: "",
      days: "",
      petId: "",
      totalPrice: "",
      paymentToken: "",
    },
  });

  const { user, loading: isUserLoading } = useFetchUser();
  // const { user, isLoading: isUserLoading, error: userError } = useUserData();

  let {
    renter,
    isLoading: isRenterLoading,
    isError: isErrorRenter,
  } = useRenterForAuth0Sub(user);

  // const routeToRenterLogin = () => {
  //   const query = { petId, startAt, endAt };
  //   const url = { pathname: "/api/auth/login-renter-book", query };
  //   const asUrl = { pathname: "/api/auth/login-renter-book", query };
  //   router.push(url, asUrl);
  // };

  // const routeToProfile = () => {
  //   const query = {};
  //   const url = { pathname: `/profile`, query };
  //   const asUrl = { pathname: `/profile`, query };
  //   router.push(url, asUrl);
  // };

  // const routeToPetDetail = (petId) => {
  //   const query = {};
  //   const url = { pathname: `/pet/${petId}`, query };
  //   const asUrl = { pathname: `/pet/${petId}`, query };
  //   router.push(url, asUrl);
  // };

  const createRenterIfNeeded = async () => {
    if (user) {
      if (!renter && !isRenterLoading) {
        let { renter: foundRenter, err: errRenter } = await getRenterForEmail(
          user.email
        );
        if (errRenter) {
          handleError(errRenter);
        }
        if (!foundRenter) {
          await createRenter();
        } else {
          const message =
            "It looks like you logged in using a different service before. Please log out and sign back in.";
          handleError(message);
        }
      }
    }
  };

  const createRenter = async () => {
    console.log("Creating new renter");
    let { renter: renterCreated, err: errRenter } = await createRenter(user);
    if (renterCreated) {
      renter = renterCreated;
    }
    if (errRenter) {
      handleError(errRenter);
    }
  };

  // load the pet
  useEffect(() => {
    async function fetchData() {
      setErrorIfMissingData();
      await createRenterIfNeeded();

      const query = router.query;
      let petId = query.petId;
      let startAt = query.startAt;
      let endAt = query.endAt;

      if (!pet && petId) {
        //console.log("fetchData");
        let { pet: foundPet, err } = await getPet(petId);
        if (foundPet) {
          const days = getDatesInRange(startAt, endAt).length - 1;
          const total = foundPet ? foundPet.dailyRentalRate * days : null;
          proposedBooking.startAt = startAt;
          proposedBooking.endAt = endAt;
          proposedBooking.days = days;
          proposedBooking.petId = foundPet._id;
          proposedBooking.totalPrice = total;
          setProposedBooking(proposedBooking);
          setPet(foundPet);
          setError(false);
        }
        if (err) {
          handleError(err);
        }
      }
    }
    fetchData();
  });

  const setErrorIfMissingData = () => {
    // don't run on server without query
    // if (!isUserLoading && (!petId || !startAt || !endAt)) {
    //   setError(
    //     "Something went wrong. We are missing information need to book."
    //   );
    // }
  };

  const handleError = (err) => {
    console.log("Book. handleError: " + err);
    if (err.includes("AccessTokenError") || err.includes("401")) {
      setMustReAuthenticate(true);
    }
    setError(err);
  };

  ///////////////////////////////////////////////////////////////////////
  // MODAL
  const confirmProposedData = () => {
    console.log("Opening modal");
    setModalOpen(true);
  };

  const setPaymentTokenID = (paymentTokenId) => {
    console.log(paymentTokenId);
    proposedBooking.paymentToken = paymentTokenId;
    setProposedBooking(proposedBooking);
  };

  // called if the modal is cancelled
  const cancelConfirmation = () => {
    console.log("cancelled");
    setModalOpen(false);
  };

  // called if the modal is confirmed
  const reservePet = async () => {
    //toast("Booking storage is not yet implemented.  Thanks for trying.");
    console.log("reservePet");
    setModalOpen(false);
    const { booking, err } = await createBooking(proposedBooking);
    if (booking) {
      toast("Booking created!");
      console.log(booking);
      return routeToProfile(router, petId);
    }
    if (err) {
      console.log(err);
      handleError(err);
    }
  };

  /////////////////////////////////////////////////////////////
  // JSX

  //Not authorized. TODO message user
  if ((!user && !isUserLoading) || mustReAuthenticate) {
    return routeToRenterLogin(router);
  }

  return (
    <Layout>
      <section id="ownerDetail">
        <Container fluid className="main-container">
          <Row>
            {/* {!user && !isUserLoading && (
              <a href="#" onClick={routeToRenterLogin()}>
                Please login or signup to continue.
              </a>
            )} */}
            {user && !pet && (
              <div>
                <Spinner animation="border" /> Loading...
              </div>
            )}
          </Row>

          {error && <BookingError error={error} petId={petId}></BookingError>}

          {user && pet && !error && (
            <>
              <div className="page-title">Review Booking Details</div>
              <Row>
                <Card>
                  <Card.Header className="page-title">{pet.name}</Card.Header>
                  <Card.Body>
                    <Card.Text>Description: {pet.description}</Card.Text>
                    <Card.Text>Species: {pet.species}</Card.Text>
                    <Card.Text>Breed: {pet.breed}</Card.Text>
                    <Card.Text>Daily Rate: {pet.dailyRentalRate}</Card.Text>
                  </Card.Body>
                </Card>
                {pet.images && pet.images[0] && (
                  <Col xs={6} md={4}>
                    <Image src={pet.images[0].url} thumbnail />
                  </Col>
                )}
              </Row>
              <Row>
                <Card>
                  <Card.Header className="page-title">
                    Booking Details
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>Total: {proposedBooking.totalPrice}</Card.Text>
                    <Card.Text>startAt: {proposedBooking.startAt}</Card.Text>
                    <Card.Text>endat: {proposedBooking.endAt}</Card.Text>
                  </Card.Body>
                </Card>
              </Row>
              <Row>
                <Col sm="6">
                  <Button
                    disabled={
                      !proposedBooking.startAt ||
                      !proposedBooking.endAt ||
                      error
                    }
                    onClick={() => confirmProposedData()}
                    variant="primary"
                  >
                    Reserve now
                  </Button>
                  <Button
                    onClick={() => routeToPetDetail(router, petId)}
                    variant="danger"
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>

              <BookingModal
                open={modalOpen}
                closeModal={cancelConfirmation}
                confirmModal={reservePet}
                booking={proposedBooking}
                rentalPrice={pet.dailyRentalRate}
                acceptPayment={setPaymentTokenID}
              />
            </>
          )}
        </Container>
      </section>
    </Layout>
  );
};

export default Book;

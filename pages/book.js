import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { Col, Container, Row, Card, Button, Image } from "react-bootstrap";
import { toast } from "react-toastify";

import Layout from "../components/shared/Layout";
//import useUserData from "../hooks/useUserData";
import { useFetchUser } from "../util/user";
import { createBooking } from "../services/bookingService";
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
import {
  useRenterForAuth0Sub,
  mutateRenterForAuth0Sub,
} from "../hooks/useRenterData";
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
const Book = ({ pet, proposedBooking, startAt, endAt }) => {
  const router = useRouter();

  let [mustReAuthenticate, setMustReAuthenticate] = useState(false);
  let [error, setError] = useState();
  let [modalOpen, setModalOpen] = useState(false);

  const { user, loading: isUserLoading } = useFetchUser();
  // const { user, isLoading: isUserLoading, error: userError } = useUserData();

  let {
    renter,
    isLoading: isRenterLoading,
    isError: isErrorRenter,
  } = useRenterForAuth0Sub(user);

  // TODO if there is an error this might loop
  const createRenterIfNeeded = async () => {
    if (user) {
      if (!renter && !isRenterLoading && !isErrorRenter) {
        let { renter: foundRenter, err: errRenter } = await getRenterForEmail(
          user.email
        );
        if (errRenter) {
          return handleError(errRenter);
        }
        if (!foundRenter) {
          await createRenter();
        } else {
          const message =
            "It looks like you logged in using a different service before. Please log out and sign back in.";
          return handleError(message);
        }
      }
    }
  };

  const createRenter = async () => {
    console.log("Creating new renter");
    let { renter: renterCreated, err: errRenter } = await createRenter(user);
    if (renterCreated) {
      await mutateRenterForAuth0Sub();
      // don't really need to set the value
      renter = renterCreated;
    }
    if (errRenter) {
      handleError(errRenter);
    }
  };

  useEffect(() => {
    async function fetchData() {
      setErrorIfMissingData();
      await createRenterIfNeeded();
    }
    fetchData();
  });

  ////////////////////////////////////////////////

  const setErrorIfMissingData = () => {
    if (!pet || !proposedBooking || !startAt || !endAt) {
      setError(
        "Something went wrong. We are missing information needed to book. Please try again."
      );
    }
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
    //setProposedBooking(proposedBooking);
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
      return routeToProfile(router, proposedBooking.petId);
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
    //debugger;
    routeToRenterLogin(router, pet ? pet._id : null, startAt, endAt);
    // If I don't return something, a nothing returned from render error will
    // splash
    return "";
  }

  return (
    <Layout>
      <section id="ownerDetail">
        <Container fluid className="main-container">
          <Row>
            {!user ||
              (!renter && (
                <div>
                  <Spinner animation="border" /> Loading...
                </div>
              ))}
          </Row>

          {error && <BookingError error={error} petId={petId}></BookingError>}

          {user && pet && proposedBooking && !error && (
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
                    onClick={() =>
                      routeToPetDetail(router, proposedBooking.petId)
                    }
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

////////////////////////////////////////////////////

// Load the pet and create the proposedBooking data
export async function getServerSideProps(context) {
  const query = context.query;
  let petId = query.petId;
  let startAt = query.startAt;
  let endAt = query.endAt;

  let pet;
  let proposedBooking = {
    startAt: "",
    endAt: "",
    days: "",
    petId: "",
    totalPrice: "",
    paymentToken: "",
  };

  if (petId) {
    let { pet: foundPet, err } = await getPet(petId);
    if (foundPet) {
      const days = getDatesInRange(startAt, endAt).length - 1;
      const total = foundPet ? foundPet.dailyRentalRate * days : null;
      proposedBooking.startAt = startAt;
      proposedBooking.endAt = endAt;
      proposedBooking.days = days;
      proposedBooking.petId = foundPet._id;
      proposedBooking.totalPrice = total;
      //setProposedBooking(proposedBooking);
      pet = foundPet;
      //setError(false);
    }
    if (err) {
      handleError(err);
    }
  }
  return {
    props: { pet, proposedBooking, startAt, endAt }, // will be passed to the page component as props
  };
}

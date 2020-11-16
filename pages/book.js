import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { Col, Container, Row, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import Layout from "../components/shared/Layout.js";
import useUserData from "../hooks/useUserData";
import { getPet, updatePet } from "../hooks/petService";
import { getDatesInRange } from "../util/date-util";
import BookingModal from "../components/book/BookingModal";

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

  const { user, isLoading: isUserLoading } = useUserData();

  // TODO we don't need all of these.
  let [pet, setPet] = useState();
  let [isEditing, setIsEditing] = useState(false);
  let [isPetDataFresh, setIsPetDataFresh] = useState(false);
  let [totalPrice, setTotalPrice] = useState(null);
  let [paymentToken, setPaymentToken] = useState(null);
  let [modalOpen, setModalOpen] = useState(false);
  let [proposedBooking, setProposedBooking] = useState({
    proposedBooking: {
      startAt: "",
      endAt: "",
      days: "",
      paymentToken: "",
    },
  });

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };
  // called by children to ask for a refresh

  const markStale = () => {
    setIsPetDataFresh(false);
  };

  const query = router.query;
  let petId = query.petId;
  let startAt = query.startAt;
  let endAt = query.endAt;

  const routeToRenterLogin = () => {
    const query = { petId, startAt, endAt };
    const url = { pathname: "/api/auth/login-renter-book", query };
    const asUrl = { pathname: "/api/auth/login-renter-book", query };
    router.push(url, asUrl);
  };

  // load the pet
  useEffect(() => {
    async function fetchData() {
      if (!isPetDataFresh) {
        console.log("fetchData");
        let { pet: foundPet, err } = await getPet(petId);
        if (foundPet) {
          setPet(foundPet);
          setIsPetDataFresh(true);

          const days = getDatesInRange(startAt, endAt).length - 1;
          const total = pet ? pet.dailyRentalRate * days : null;
          proposedBooking.startAt = startAt;
          proposedBooking.endAt = endAt;
          proposedBooking.days = days;
          proposedBooking.totalPrice = total;
          setProposedBooking(proposedBooking);
          setTotalPrice(total);
        }
        if (err) {
          console.log(err);
          // TODO I need an error component
        }
      }
    }
    fetchData();
  });

  ///////////////////////////////////////////////////////////////////////
  // MODAL
  const confirmProposedData = () => {
    console.log("Opening modal");
    setModalOpen(true);
  };

  const setPaymentTokenID = (paymentTokenId) => {
    console.log(paymentTokenId);
    setPaymentToken(paymentTokenId);
    proposedBooking.paymentToken = paymentTokenId;
    setProposedBooking(proposedBooking);
  };

  // called if the modal is cancelled
  const cancelConfirmation = () => {
    console.log("cancelled");
    setModalOpen(false);
  };

  // called if the modal is confirmed
  const reservePet = () => {
    toast("Booking storage is not yet implemented.  Thanks for trying.");
    console.log("reservePet");
    setModalOpen(false);
    // call the booking service
    // route to profile page
  };

  /////////////////////////////////////////////////////////////
  // JSX

  //Not authorized. TODO message user
  if (!user && !isUserLoading) {
    return routeToRenterLogin();
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
            {(!petId || !startAt || !endAt) && (
              // TODO make a general error component
              <h4>
                Something went wrong. We are missing information need to book.{" "}
                {/* <a href="#" onClick={router.back()}>
          Please go back and try again.
        </a> */}
              </h4>
            )}
          </Row>

          {user && pet && (
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
              </Row>
              <Row>
                <Card>
                  <Card.Header className="page-title">
                    Booking Details
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>Total: {totalPrice}</Card.Text>
                    <Card.Text>startAt: {startAt}</Card.Text>
                    <Card.Text>endat: {endAt}</Card.Text>
                  </Card.Body>
                </Card>
              </Row>
              <Row>
                <Col sm="6">
                  <Button
                    disabled={!startAt || !endAt}
                    onClick={() => confirmProposedData()}
                    variant="primary"
                  >
                    Reserve now
                  </Button>
                </Col>
              </Row>
              <BookingModal
                open={modalOpen}
                closeModal={cancelConfirmation}
                confirmModal={reservePet}
                booking={proposedBooking}
                rentalPrice={pet.dailyRentalRate}
                disabled={!paymentToken}
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

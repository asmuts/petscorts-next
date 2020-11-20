import React, { useState } from "react";
import { toast } from "react-toastify";
import { Row, Col, Form, CardDeck, Card, Button } from "react-bootstrap";

import { formatDate } from "../../util/date-util";
import { confirmPayment, rejectPayment } from "../../services/paymentService";
import { useOwnerBookingData } from "../../hooks/useOwnerBookingData";
//import { renderPetCardImage } from "../pet/PetCardImage";
import OwnerReviewBookingModal from "./OwnerReviewBookingModal";

/*
  This will be more complicated than renter booking listing.
  The owner will need the ability to review and approve.
  A modal will work for now.

  Filter by pending, etc.
      enum: ["PENDING", "ACTIVE", "CANCELLED"],

  Need a way to see renter details.

  I should eventually make a dashboard as an exercise.
*/

const OwnerBookings = ({ ownerId }) => {
  const { bookings, isLoading, isError } = useOwnerBookingData(ownerId);
  let [showOld, setShowOld] = useState(false);
  let [modalOpen, setModalOpen] = useState(false);

  const isOldBooking = (booking) => {
    // see if it ends before today
    const endDate = new Date(booking.endAt);
    const today = new Date();
    return endDate < today;
  };

  const areThereOldBookings = (bookings) => {
    return bookings.some((booking) => {
      isOldBooking(booking);
    });
  };

  ///////////////////////////////////////////////////////////////////////
  // MODAL
  const reviewBooking = () => {
    console.log("Opening modal");
    setModalOpen(true);
  };

  // called if the modal is cancelled
  const cancelConfirmation = () => {
    console.log("cancelled");
    setModalOpen(false);
  };

  // called if the modal is confirmed
  const approvePendingBooking = async (booking) => {
    toast("Booking approval is not yet implemented.  Almost there . . .");
    console.log("approvePendingBooking" + booking);
    console.log(booking);
    setModalOpen(false);

    // THIS SHOULD CALL THE PAYMENT SERVICE
    await confirmPayment(booking.payment._id);
  };

  // called if the modal is rejected
  const rejectPendingBooking = async (booking) => {
    toast("Booking rejection is not yet implemented.  Almost there . . .");
    console.log("rejectPendingBooking" + booking);
    setModalOpen(false);
    await rejectPayment(booking.payment._id);
  };

  //////////////////////////////////////////////////////////////////////
  // JSX
  const renderCard = (booking) => {
    return (
      <Col className="col-md-4 col-xs-6" key={booking._id}>
        <Card className="pet-card">
          <div className="card-block">
            <Card.Header className="card-title">
              Pet: {booking.pet.name}
            </Card.Header>
            {/* {renderPetCardImage(booking.pet)} */}
            <Card.Text className="card-text">
              {formatDate(booking.startAt)} to {formatDate(booking.endAt)}
            </Card.Text>
            <Card.Text className="card-text">
              Total: ${booking.totalPrice}
            </Card.Text>
            <Card.Text className="card-text">
              Status: {booking.status}
            </Card.Text>
            <Card.Footer>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => reviewBooking(booking)}
              >
                Review
              </Button>
            </Card.Footer>

            <OwnerReviewBookingModal
              open={modalOpen}
              closeModal={cancelConfirmation}
              confirmModal={approvePendingBooking}
              booking={booking}
              rejectModal={rejectPendingBooking}
            />
          </div>
        </Card>
      </Col>
    );
  };

  if (isLoading) {
    return <p>Loading bookings...</p>;
  }

  return (
    <>
      {!bookings && !isLoading && (
        <p className="page-title">You haven't booked any pets.</p>
      )}
      {bookings && (
        <>
          <Row>
            <p className="page-title">Your bookings.</p>
            {areThereOldBookings(bookings) && (
              <Form.Check
                label="Show Old"
                value={showOld}
                onClick={() => setShowOld(!showOld)}
              />
            )}
          </Row>
          <Row>
            <section id="petBookings">
              <CardDeck>
                {bookings.map((booking) => {
                  if (!showOld && isOldBooking(booking)) {
                    return;
                  } else {
                    return renderCard(booking);
                  }
                })}
              </CardDeck>
            </section>
          </Row>
        </>
      )}
    </>
  );
};

export default OwnerBookings;

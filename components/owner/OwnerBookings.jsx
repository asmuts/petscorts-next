import React, { useState } from "react";
import { toast } from "react-toastify";
import { Row, Col, Form, CardDeck, Card, Button } from "react-bootstrap";

import { formatDate } from "../../util/date-util";
import { confirmPayment, rejectPayment } from "../../services/paymentService";
import {
  useOwnerBookingData,
  mutateOwnerBookingData,
} from "../../hooks/useOwnerBookingData";
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

const OwnerBookings = ({ ownerId, handleError }) => {
  const { bookings, isLoading, isError } = useOwnerBookingData(ownerId);
  let [showOld, setShowOld] = useState(false);
  let [selectedBooking, setSelectedBooking] = useState();
  let [modalOpen, setModalOpen] = useState(false);

  const isOldBooking = (booking) => {
    // see if it ends before today
    const endDate = new Date(booking.endAt);
    const today = new Date();
    return endDate < today;
  };

  const areThereOldBookings = (bookings) => {
    if (!bookings || bookings.length === 0) return false;
    return bookings.some((b) => {
      isOldBooking(b);
    });
  };

  ///////////////////////////////////////////////////////////////////////
  // MODAL
  const reviewBooking = (booking) => {
    console.log("Opening modal");
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  // called if the modal is cancelled
  const cancelConfirmation = () => {
    console.log("cancelled");
    setModalOpen(false);
  };

  // called if the modal is confirmed
  const approvePendingBooking = async (booking) => {
    console.log("Called approvePendingBooking");
    //console.log(booking);
    setModalOpen(false);

    // THIS SHOULD CALL THE PAYMENT SERVICE
    const { payment, err } = await confirmPayment(booking.payment._id);
    if (err) return handleError(err);
    mutateOwnerBookingData(booking.owner);
    toast("Booking approved!");
  };

  // called if the modal is rejected
  const rejectPendingBooking = async (booking) => {
    console.log("rejectPendingBooking" + booking);
    setModalOpen(false);
    const { payment, err } = await rejectPayment(booking.payment._id);
    if (err) return handleError(err);
    mutateOwnerBookingData(booking.owner);
    toast("Booking rejected.");
  };

  //////////////////////////////////////////////////////////////////////
  // JSX
  const renderCard = (booking) => {
    return (
      <Col className="col-md-4 col-xs-6" key={booking._id}>
        <Card className="booking-card">
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
              Payment: {booking.payment.status}
            </Card.Text>
            <Card.Text className="card-text">
              Booking: {booking.status}
            </Card.Text>
            <Card.Footer>
              {booking.payment.status === "PENDING" && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => reviewBooking(booking)}
                >
                  Review
                </Button>
              )}
            </Card.Footer>
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
      {(!bookings && !isLoading) ||
        (bookings.length === 0 && (
          <p className="page-title">Three are no bookings for your pets.</p>
        ))}
      {bookings && bookings.length > 0 && (
        <>
          <p className="page-title">Manage bookings</p>
          {areThereOldBookings(bookings) && (
            <Form.Check
              label="Show Old"
              value={showOld}
              onClick={() => setShowOld(!showOld)}
            />
          )}

          <section id="petBookings">
            <CardDeck>
              {bookings.map((b) => {
                if (!showOld && isOldBooking(b)) {
                  return;
                } else {
                  return renderCard(b);
                }
              })}
            </CardDeck>
            <OwnerReviewBookingModal
              open={modalOpen}
              closeModal={cancelConfirmation}
              confirmModal={approvePendingBooking}
              booking={selectedBooking}
              rejectModal={rejectPendingBooking}
            />
          </section>
        </>
      )}
    </>
  );
};

export default OwnerBookings;

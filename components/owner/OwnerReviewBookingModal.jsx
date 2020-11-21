import React, { useState } from "react";
import { Modal, Card, Button } from "react-bootstrap";

import { formatDate } from "../../util/date-util";

export default function OwnerReviewBookingModal(props) {
  const { open, closeModal, booking, confirmModal, rejectModal } = props;

  const doCloseModal = () => {
    closeModal();
  };

  return (
    <Modal
      show={open}
      onHide={doCloseModal}
      onClose={doCloseModal}
      //size="sm"
      classNames={{ modal: "booking-modal" }}
    >
      {booking && (
        <>
          <Card>
            <Card.Header className="page-title">Review Booking </Card.Header>
            <Card.Body>
              <Card.Text className="card-title">
                Pet: {booking.pet.name}
              </Card.Text>
              <Card.Text>
                {formatDate(booking.startAt)} to {formatDate(booking.endAt)}
              </Card.Text>
              <Card.Text>
                {" "}
                Total Price: $<em>{booking.totalPrice} </em>
              </Card.Text>
              <Card.Text>TODO display renter name</Card.Text>
            </Card.Body>
            <Card.Footer>
              Click accept to process payment and accept booking.
            </Card.Footer>
          </Card>

          <Modal.Footer>
            <Button onClick={() => confirmModal(booking)} variant="success">
              Accept Booking
            </Button>
            <Button
              type="button"
              onClick={() => rejectModal(booking)}
              variant="danger"
            >
              Reject Booking!
            </Button>
            <Button type="button" onClick={doCloseModal} variant="danger">
              Cancel
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}

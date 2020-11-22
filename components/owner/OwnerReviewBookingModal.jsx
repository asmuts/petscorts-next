import React, { useState } from "react";
import { Modal, Card, Button, Row, Col } from "react-bootstrap";

import { formatDate } from "../../util/date-util";
//import { usePetData, mutatePetData } from "../../hooks/usePetData";
import { renderPetCardImage } from "../pet/PetCardImage";

export default function OwnerReviewBookingModal(props) {
  const { open, closeModal, booking, confirmModal, rejectModal } = props;

  // const { pet, isLoading: isPetLoading, isError: isPetError } = usePetData(
  //   booking ? booking.pet._id : ""
  // );

  const doCloseModal = () => {
    closeModal();
  };

  const doConfirm = (booking) => {
    if (pet) mutatePetData(pet._id);
    confirmModal(booking);
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
          <section id="ownerBookingModal">
            <Card>
              <Card.Header className="page-title">Review Booking </Card.Header>
              <Row>
                <Col>
                  <Card.Body>
                    <Card.Text className="card-title">
                      Pet: {booking.pet.name}
                    </Card.Text>
                    <Card.Text>
                      {formatDate(booking.startAt)} to{" "}
                      {formatDate(booking.endAt)}
                    </Card.Text>
                    <Card.Text>
                      {" "}
                      Total Price: $<em>{booking.totalPrice} </em>
                    </Card.Text>
                    <Card.Text>TODO display renter name</Card.Text>
                  </Card.Body>
                </Col>
                <Col> {renderPetCardImage(booking.pet)}</Col>
              </Row>
              <Card.Footer>
                Click accept to process payment and accept booking.
              </Card.Footer>
            </Card>

            <Modal.Footer>
              <Button onClick={() => doConfirm(booking)} variant="success">
                Accept Booking
              </Button>
              <Button
                type="button"
                onClick={() => rejectModal(booking)}
                variant="danger"
              >
                Reject Booking
              </Button>
              <Button type="button" onClick={doCloseModal} variant="secondary">
                Cancel
              </Button>
            </Modal.Footer>
          </section>
        </>
      )}
    </Modal>
  );
}

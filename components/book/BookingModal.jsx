import React, { useState } from "react";
import { Modal, Card, Button } from "react-bootstrap";

import Payment from "./payment/Payment";

// Stripe testing data
// https://stripe.com/docs/testing
// test visa 4242424242424242, any cvc, any future date
// token: tok_visa
// payment method: pm_card_visa

// TODO pass the pet name up here to display
export default function BookingModal(props) {
  const {
    open,
    closeModal,
    booking,
    confirmModal,
    rentalPrice,
    acceptPayment,
    disabled,
  } = props;

  let [tokenStored, setTokenStored] = useState(false);
  let [token, setToken] = useState(null);

  const storePaymentToken = (paymentToken) => {
    // tell caller the id
    acceptPayment(paymentToken.id);
    // store token locally for display purposes
    setToken(paymentToken);
    setTokenStored(true);
  };

  const doCloseModal = () => {
    // not telling the parent
    // these are just for modal display.
    // I want the card form to show up if they re-open
    // NO. if it fails, they can't re-use the token
    setToken(null);
    setTokenStored(false);
    closeModal();
  };

  const renderConfirmMessage = () => {
    return (
      <Card>
        <Card.Header>Payment information Stored.</Card.Header>
        <Card.Body>
          <Card.Text>type: {token.type}</Card.Text>
          {token && token.card && (
            <>
              <Card.Text>xxxxxxxxxxxx{token.card.last4}</Card.Text>
              <Card.Text>
                exp.: ({token.card.exp_month} / {token.card.exp_year})
              </Card.Text>
            </>
          )}
          <Card.Footer>Click confirm to book.</Card.Footer>
        </Card.Body>
      </Card>
    );
  };

  return (
    <section id="bookingModal">
      <Modal
        show={open}
        onHide={doCloseModal}
        onClose={doCloseModal}
        little
        classNames={{ modal: "booking-modal" }}
      >
        <Card>
          <Card.Header className="page-title">Confirm Booking </Card.Header>
          <Card.Body>
            <Card.Text>
              {booking.startAt} / {booking.endAt}
            </Card.Text>
            <Card.Text>
              <em>{booking.days}</em> days /$ <em>{rentalPrice}</em> per Day
            </Card.Text>
            <Card.Text>
              {" "}
              Price: $<em>{booking.totalPrice} </em>
            </Card.Text>
          </Card.Body>
        </Card>

        {!tokenStored && <Payment storePaymentToken={storePaymentToken} />}

        {tokenStored && renderConfirmMessage()}

        <Modal.Footer>
          {tokenStored && (
            <Button
              disabled={disabled}
              onClick={confirmModal}
              variant="success"
            >
              Confirm
            </Button>
          )}
          <Button type="button" onClick={doCloseModal} variant="danger">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

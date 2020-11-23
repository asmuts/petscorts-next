import React, { useState } from "react";
import Link from "next/link";

import { formatDate } from "../../util/date-util";
import { Row, Col, Form, CardDeck, Card } from "react-bootstrap";
import { useRenterBookingData } from "../../hooks/useRenterBookingData";
import { renderPetCardImage } from "../pet/PetCardImage";

const RenterBookings = ({ renterId }) => {
  const { bookings, isLoading, isError } = useRenterBookingData(renterId);
  let [showOld, setShowOld] = useState(false);

  const isOldBooking = (booking) => {
    // see if it ends before today
    const endDate = new Date(booking.endAt);
    const today = new Date();
    return endDate < today;
  };

  const areThereOldBookings = (bookings) => {
    if (!bookings) return false;
    return bookings.some((booking) => {
      isOldBooking(booking);
    });
  };

  const renderCard = (booking) => {
    return (
      <Col
        className="col-md-4 col-xs-6"
        key={booking.pet._id + "" + booking.startAt}
      >
        <Link className="pet-detail-link" href={`/pet/${booking.pet._id}`}>
          <Card className="pet-card">
            <div className="card-block">
              <Card.Header className="card-title">
                {booking.pet.name}
              </Card.Header>
              {renderPetCardImage(booking.pet)}
              <Card.Text className="card-text">
                {formatDate(booking.startAt)} to {formatDate(booking.endAt)}
              </Card.Text>
              <Card.Text className="card-text">
                Status: {booking.status}
              </Card.Text>
            </div>
          </Card>
        </Link>
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

export default RenterBookings;

import React, { useState } from "react";
import { formatDate } from "../../util/date-util";
import { Form, CardDeck, Card } from "react-bootstrap";
import { useRenterBookingDates } from "../../hooks/useRenterBookingData";
import Link from "next/link";

const RenterBookings = ({ renterId }) => {
  const { bookings, isLoading, isError } = useRenterBookingDates(renterId);
  let [showOld, setShowOld] = useState(false);

  const isOldBooking = (booking) => {
    // TODO implement
    // see if it ends before today
    const endDate = new Date(booking.endAt);
    const today = new Date();
    return endDate < today;
  };

  const renderCard = (booking) => {
    return (
      <div className="col-md-4 col-xs-6">
        <Link className="pet-detail-link" href={`/pet/${booking.pet._id}`}>
          <Card>
            <Card.Header className="card-title">
              Pet: {booking.pet.name}
            </Card.Header>
            <Card.Text>
              {formatDate(booking.startAt)} to {formatDate(booking.endAt)}
            </Card.Text>
            <Card.Text>Status: {booking.status}</Card.Text>
          </Card>
        </Link>
      </div>
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
          <p className="page-title">Your bookings.</p>
          <Form.Check
            label="Show Old"
            value={showOld}
            onClick={() => setShowOld(!showOld)}
          />
          <CardDeck>
            {bookings.map((booking) => {
              if (!showOld && isOldBooking(booking)) {
                return;
              } else {
                return renderCard(booking);
              }
            })}
          </CardDeck>
        </>
      )}
    </>
  );
};

export default RenterBookings;

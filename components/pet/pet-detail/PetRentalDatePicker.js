import React, { Fragment, useState } from "react";
import { useRouter } from "next/router";
import "react-daterange-picker/dist/css/react-calendar.css";
import { Col, Form, Button, Container } from "react-bootstrap";
import DateRangePicker from "react-daterange-picker";
import originalMoment from "moment";
import { extendMoment } from "moment-range";
import { getDatesInRange } from "../../../util/date-util";

const moment = extendMoment(originalMoment);

// TODO get booking dates from pet and set them
// Right now I'm just harcdcoding dates as an example
const PetRentalDatePicker = ({ pet }) => {
  const router = useRouter();

  const [value, setValue] = useState(null);
  //const [states, setStates] = useState(null);
  const [days, setDays] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);

  const stateDefinitions = {
    available: {
      color: null,
      label: "Available",
    },
    enquire: {
      color: "#ffd200",
      label: "Enquire",
    },
    unavailable: {
      selectable: false,
      color: "#78818b",
      label: "Unavailable",
    },
  };

  //const dateRanges = [];

  const handleSelect = (range, states) => {
    // range is a moment-range object
    setValue(range);
    //setStates(states);
    const days = getDatesInRange(range.start, range.end).length - 1;
    const total = pet.dailyRentalRate * days;
    setDays(days);
    setTotalPrice(total);
  };

  const dateRanges = [
    // {
    //   state: "enquire",
    //   range: moment.range(
    //     moment().add(2, "weeks").subtract(5, "days"),
    //     moment().add(2, "weeks").add(6, "days")
    //   ),
    // },
    {
      state: "unavailable",
      range: moment.range(
        moment().add(3, "weeks"),
        moment().add(3, "weeks").add(5, "days")
      ),
    },
  ];

  const preventDefault = (f) => (e) => {
    e.preventDefault();
    f(e);
  };

  const handleSubmit = preventDefault(() => {
    gotoBooking();
  });

  const gotoBooking = () => {
    const query = {
      petId: pet._id,
      startAt: value.start.format("MM/DD/YY"),
      endAt: value.end.format("MM/DD/YY"),
    };
    const url = { pathname: "/book", query };
    const asUrl = { pathname: "/book", query };
    router.push(url, asUrl);
  };

  return (
    <div className="row">
      <div className="col-lg-9 col-sm-7 col-md-6 d-md-block ">
        <DateRangePicker
          firstOfWeek={1}
          numberOfCalendars={2}
          selectionType="range"
          minimumDate={new Date()}
          stateDefinitions={stateDefinitions}
          dateStates={dateRanges}
          defaultState="available"
          showLegend={true}
          value={value}
          onSelect={handleSelect}
        />
      </div>
      <div className="d-md-block col-lg-3 col-md-6 col-xs-3">
        <div className="booking-form">
          <Container className="inner-container rounded">
            <h4>
              {totalPrice && (
                <>
                  ${totalPrice} for {days} day{days > 1 && "s"}
                </>
              )}
              {!totalPrice && <>$ {pet.dailyRentalRate} per day</>}
            </h4>

            <Form noValidate onSubmit={handleSubmit}>
              <Form.Row>
                <Col>
                  <Form.Control
                    readOnly
                    className="rounded-pill"
                    placeholder="Start Date"
                    value={value ? value.start.format("MM/DD/YY") : ""}
                  />
                </Col>
                <Col>
                  <Form.Control
                    readOnly
                    className="rounded-pill"
                    placeholder="End Date"
                    value={value ? value.end.format("MM/DD/YY") : ""}
                  />
                </Col>
              </Form.Row>
              {value && value.end && value.start ? (
                <Button
                  className="submit-button rounded-pill"
                  variant="primary"
                  type="submit"
                >
                  Reserve
                </Button>
              ) : (
                <Button
                  className="submit-button rounded-pill"
                  variant="primary"
                  type="submit"
                  disabled
                >
                  Reserve
                </Button>
              )}
            </Form>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default PetRentalDatePicker;

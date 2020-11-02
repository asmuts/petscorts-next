import React, { Fragment, useState } from "react";
import "react-daterange-picker/dist/css/react-calendar.css";

import { Col, Form, Button } from "react-bootstrap";
import DateRangePicker from "react-daterange-picker";
import originalMoment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(originalMoment);

const PetRentalDatePicker = ({ pet }) => {
  const [value, setValue] = useState(null);
  const [states, setStates] = useState(null);

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
    setStates(states);
  };

  const dateRanges = [
    {
      state: "enquire",
      range: moment.range(
        moment().add(2, "weeks").subtract(5, "days"),
        moment().add(2, "weeks").add(6, "days")
      ),
    },
    {
      state: "unavailable",
      range: moment.range(
        moment().add(3, "weeks"),
        moment().add(3, "weeks").add(5, "days")
      ),
    },
  ];

  return (
    <div className="row">
      <div className="col-lg-9 col-sm-7 d-md-block ">
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
      <div className="col-lg-3 col-xs-3 booking-form rounded">
        <p>{pet.dailyRate || "?"} per day.</p>
        <Form>
          <Form.Row>
            <Col>
              <Form.Control
                readOnly
                className="rounded-pill"
                placeholder="Start Date"
                value={value != null && value.start.format("MM/DD/YY")}
              />
            </Col>
            <Col>
              <Form.Control
                readOnly
                className="rounded-pill"
                placeholder="End Date"
                value={value != null && value.end.format("MM/DD/YY")}
              />
            </Col>
          </Form.Row>
          <Button
            className="submit-button rounded-pill"
            variant="primary"
            type="submit"
          >
            Reserve
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default PetRentalDatePicker;

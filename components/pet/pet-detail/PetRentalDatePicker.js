import React, { Fragment, useState } from "react";
import "react-daterange-picker/dist/css/react-calendar.css";

import DateRangePicker from "react-daterange-picker";
import originalMoment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(originalMoment);

const PetRentalDatePicker = () => {
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
    <div>
      <div className="d-none col-md-12 d-md-block">
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
    </div>
  );

  //});
};

// {value != null && value.start.format("YYYY-MM-DD")}
// {" - "}
// {value != null && value.end.format("YYYY-MM-DD")}

export default PetRentalDatePicker;

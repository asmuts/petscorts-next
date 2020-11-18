import * as moment from "moment";

export const getDatesInRange = (startAt, endAt, dateFormat = "MM/DD/YYYY") => {
  const tempDates = [];
  const mEndAt = moment(endAt, dateFormat);
  let mStartAt = moment(startAt, dateFormat);

  while (mStartAt < mEndAt) {
    tempDates.push(mStartAt.format(dateFormat));
    mStartAt = mStartAt.add(1, "day");
  }

  tempDates.push(mEndAt.format(dateFormat));

  return tempDates;
};

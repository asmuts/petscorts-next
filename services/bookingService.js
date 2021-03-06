import Joi from "joi";
import httpAuth from "../util/authHttpService";

export const getBookingsForRenter = async (renterId) => {
  console.log("getBookingsForRenter " + renterId);
  const BOOKING_API_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
  const url = `${BOOKING_API_URI}/api/v1/booking/renter/${renterId}`;
  try {
    const res = await httpAuth.get(url);
    if (res.status === 200) {
      let bookings = res.data.data;
      //console.log(bookings);
      return { bookings };
    }
    return { err: res.data.error };
  } catch (e) {
    console.log(e, `Error calling ${url}`);
    return { err: e.message };
  }
};

export const getBookingsForOwner = async (ownerId) => {
  const BOOKING_API_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
  const url = `${BOOKING_API_URI}/api/v1/booking/owner/${ownerId}`;
  try {
    const res = await httpAuth.get(url);
    if (res.status === 200) {
      let bookings = res.data.data;
      return { bookings };
    }
    return { err: res.data.error };
  } catch (e) {
    console.log(e, `Error calling ${url}`);
    return { err: e.message };
  }
};

// create booking --> booking api:
// const { startAt, endAt, totalPrice, days, petId, paymentToken }
export const createBooking = async (booking) => {
  const values = {
    startAt: booking.startAt,
    endAt: booking.endAt,
    totalPrice: booking.totalPrice,
    days: booking.days,
    petId: booking.petId,
    paymentToken: booking.paymentToken,
  };

  const { error } = validateBooking(values);
  if (error) {
    return { err: error.message };
  }

  const BOOKING_API_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
  const url = `${BOOKING_API_URI}/api/v1/booking/`;
  try {
    const res = await httpAuth.post(url, values);
    if (res.status === 200) {
      booking = res.data.data;
      console.log("Created booking.");
      return { booking };
    }
    return { err: res.data.error };
  } catch (e) {
    console.log(e, `Error calling ${url}`);
    return { err: e.message };
  }
};

export const approveBooking = async (booking) => {
  return { err: "Not implemented" };
};

export const rejectBooking = async (booking) => {
  return { err: "Not implemented" };
};

const validateBooking = function (booking) {
  const schema = Joi.object({
    startAt: Joi.string().optional().min(8).max(10),
    endAt: Joi.string().required().min(8).max(10),
    totalPrice: Joi.number().required(),
    days: Joi.number().required(),
    petId: Joi.string().required().max(128),
    paymentToken: Joi.string().required().max(128),
  });
  return schema.validate(booking);
};

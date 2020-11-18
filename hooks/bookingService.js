import Joi from "joi";
import httpAuth from "../services/authHttpService";

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

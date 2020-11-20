import Joi from "joi";
import httpAuth from "../util/authHttpService";

export const confirmPayment = async (paymentId) => {
  const values = {
    paymentId,
  };

  const API_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
  const url = `${API_URI}/api/v1/payment/${paymentId}`;
  try {
    const res = await httpAuth.post(url, values);
    if (res.status === 200) {
      payment = res.data.data;
      console.log("Confirmed payment.");
      return { payment };
    }
    return { err: res.data.error };
  } catch (e) {
    console.log(e, `Error calling ${url}`);
    return { err: e.message };
  }
};

export const rejectPayment = async (paymentId) => {
  const values = {
    paymentId,
  };

  const API_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
  const url = `${API_URI}/api/v1/payment/${paymentId}`;
  try {
    const res = await httpAuth.delete(url, values);
    if (res.status === 200) {
      payment = res.data.data;
      console.log("Rejected payment.");
      return { payment };
    }
    return { err: res.data.error };
  } catch (e) {
    console.log(e, `Error calling ${url}`);
    return { err: e.message };
  }
};

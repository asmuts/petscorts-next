import axios from "axios";
import { toast } from "react-toastify";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log("Unepected error", error);
    //toast("An unexpected error occurred.");
  }

  return Promise.reject(error);
});

// can't do this with server side rendering!
// function setAccessToken(accessToken) {
//   axios.defaults.headers.common["authorization"] = accessToken;
//   // headers: {
//   //   Authorization: `Bearer ${accessToken}`
//   // }
// }

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};

import http from "../services/httpService";
import useSWR from "swr";

export const usePetBookingDates = (petId) => {
  const options = { revalidateOnFocus: false, revalidateOnReconnect: false };
  const fetcher = (url) => http.get(url).then((res) => res.data.data);

  const { data, mutate, error } = useSWR(
    () => getBookingDatesAPIUrl(petId),
    fetcher,
    {},
    options
  );
  return {
    dates: data,
    mutate,
    isLoading: !error && !data,
    isError: error,
  };
};

export const mutatePetBookingDates = (petId) => {
  console.log("calling mutate");
  mutate(getBookingDatesAPIUrl(petId));
};

function getBookingDatesAPIUrl(petId) {
  const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
  let apiRoute = `/api/v1/booking/dates/pet/${petId}`;
  const URL = baseURL + apiRoute;
  return URL;
}

//localhost:3001/api/v1/booking/dates/pet/5fab1c60e83f894230e66e56

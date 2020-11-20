import useSWR from "swr";
import { getBookingsForRenter } from "../services/bookingService";
import { fetch } from "./util/service-fetcher";

// uses the service-fetcher (fetch) to use the sercice to call the API
export const useRenterBookingData = (renterId) => {
  const options = { revalidateOnFocus: false, revalidateOnReconnect: false };

  const { data, mutate, error } = useSWR(
    getCacheKey(renterId),
    () => fetch(getBookingsForRenter, renterId),
    {},
    options
  );
  console.log(data);
  return {
    bookings: data ? data.bookings : {},
    mutate,
    isLoading: !error && !data,
    isError: error,
  };
};

const getCacheKey = (id) => {
  return id + ":useRenterBookingDates";
};

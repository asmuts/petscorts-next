import useSWR from "swr";
import { getBookingsForOwner } from "../services/bookingService";
import { fetch } from "./util/service-fetcher";

// uses the service-fetcher (fetch) to use the sercice to call the API
export const useOwnerBookingData = (ownerId) => {
  const options = { revalidateOnFocus: false, revalidateOnReconnect: false };

  const { data, mutate, error } = useSWR(
    getCacheKey(ownerId),
    () => fetch(getBookingsForOwner, ownerId),
    {},
    options
  );
  return {
    bookings: data ? data.bookings : {},
    mutate,
    isLoading: !error && !data,
    isError: error,
  };
};

// I might be able to make this part of the service fetcher
const getCacheKey = (id) => {
  return id + ":useOwnerBookingDates";
};

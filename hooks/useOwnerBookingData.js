import useSWR, { mutate } from "swr";
import { getBookingsForOwner } from "../services/bookingService";
import { fetch } from "./util/service-fetcher";

// uses the service-fetcher (fetch) to use the sercice to call the API
export const useOwnerBookingData = (ownerId) => {
  //const options = { revalidateOnFocus: true, revalidateOnReconnect: false };
  const options = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onErrorRetry: (error, key, option, revalidate, { retryCount }) => {
      if (retryCount >= 5) return;
      if (error.status === 404) return;
      // retry after 1 seconds
      setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 1000);
    },
  };
  //
  const { data, mutate, error } = useSWR(
    () => (ownerId ? getCacheKey(ownerId) : null),
    () => fetch(getBookingsForOwner, ownerId),
    {},
    options
  );
  return {
    bookings: data ? data.bookings : [],
    mutate,
    isLoading: !error && ownerId && !data,
    isError: error,
  };
};

export const mutateOwnerBookingData = (ownerId) => {
  //console.log("calling mutate");
  mutate(getCacheKey(ownerId));
};

// I might be able to make this part of the service fetcher
const getCacheKey = (id) => {
  return id + ":useOwnerBookingData";
};

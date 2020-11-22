import useSWR, { mutate } from "swr";
import { getPet } from "../services/petService";
import { fetch } from "./util/service-fetcher";

// uses the service-fetcher (fetch) to use the sercice to call the API
export const usePetData = (petId) => {
  const options = { revalidateOnFocus: true, revalidateOnReconnect: true };

  const { data, mutate, error } = useSWR(
    getCacheKey(petId),
    () => fetch(getPet, petId),
    {},
    options
  );
  return {
    pet: data ? data.pet : null,
    mutate,
    isLoading: !error && !data,
    isError: error,
  };
};

export const mutatePetData = (petId) => {
  //console.log("calling mutate");
  mutate(getCacheKey(petId));
};

// I might be able to make this part of the service fetcher
const getCacheKey = (id) => {
  return id + ":usePetData";
};

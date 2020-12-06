import useSWR, { mutate } from "swr";
import { fetch } from "./util/service-fetcher";
import { getOwnerForAuth0Sub } from "../services/ownerService";

export const useOwnerForAuth0Sub = (user) => {
  // https://github.com/vercel/swr#error-retries
  //const options = {};
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

  // https://swr.vercel.app/docs/conditional-fetching#dependent
  const { data, mutate, error } = useSWR(
    () => (user ? getCacheKey(user.sub) : null),
    () => fetch(getOwnerForAuth0Sub, user ? user.sub : null),
    {},
    options
  );
  //
  return {
    owner: data ? data.owner : null,
    mutate,
    isLoading: !error && !data,
    isError: error,
  };
};

export const mutateOwnerForAuth0Sub = (auth0_sub, owner) => {
  mutate(getCacheKey(auth0_sub), owner, false);
};

const getCacheKey = (auth0_sub) => {
  return auth0_sub + ":useOwnerData";
};

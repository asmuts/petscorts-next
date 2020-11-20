import http from "../util/authHttpService";
import useSWR, { mutate } from "swr";

// TODO use the serives as fetchers
// Make a serviceFetcher Util that throws on error and uses services

export const useOwnerForAuth0Sub = (user) => {
  // https://github.com/vercel/swr#error-retries
  const options = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onErrorRetry: (error, key, option, revalidate, { retryCount }) => {
      if (retryCount >= 5) return;
      if (error.status === 404) return;
      // retry after 5 seconds
      setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 5000);
    },
  };
  const fetcher = (url) => http.get(url).then((res) => res.data.data);

  // https://swr.vercel.app/docs/conditional-fetching#dependent
  const { data, mutate, error } = useSWR(
    () => getOwnerDataAuth0SubAPIUrl(user.sub),
    fetcher,
    {},
    options
  );
  return {
    owner: data,
    mutate,
    isLoading: !error && !data,
    isError: error,
  };
};

export const mutateOwnerForAuth0Sub = (auth0_sub) => {
  console.log("calling mutate");
  mutate(getOwnerDataAuth0SubAPIUrl(auth0_sub));
};

function getOwnerDataAuth0SubAPIUrl(auth0_sub) {
  console.log("Looking for owner with auth0_sub [" + auth0_sub + "]");
  const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;

  // make sure scopes in the config includes email
  let ownerApiRoute = `/api/v1/owners/auth0_sub/${auth0_sub}`;
  const ownerURL = baseURL + ownerApiRoute;
  return ownerURL;
}

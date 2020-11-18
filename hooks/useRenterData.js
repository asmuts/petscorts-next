import http from "../util/authHttpService";
import useSWR, { mutate } from "swr";

export const useRenterForAuth0Sub = (user) => {
  const options = { revalidateOnFocus: false, revalidateOnReconnect: false };
  const fetcher = (url) => http.get(url).then((res) => res.data.data);

  // https://swr.vercel.app/docs/conditional-fetching#dependent
  const { data, mutate, error } = useSWR(
    () => getRenterDataAuth0SubAPIUrl(user.sub),
    fetcher,
    {},
    options
  );
  return {
    renter: data,
    mutate,
    isLoading: !error && !data,
    isError: error,
  };
};

export const mutateRenterForAuth0Sub = async (auth0_sub) => {
  console.log("calling mutate");
  await mutate(getRenterDataAuth0SubAPIUrl(auth0_sub));
};

function getRenterDataAuth0SubAPIUrl(auth0_sub) {
  //console.log("Looking for user with auth0_sub [" + auth0_sub + "]");
  const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;

  // make sure scopes in the config includes email
  let RenterApiRoute = `/api/v1/renters/auth0_sub/${auth0_sub}`;
  const RenterURL = baseURL + RenterApiRoute;
  return RenterURL;
}

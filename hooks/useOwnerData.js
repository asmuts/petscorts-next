import http from "../services/authHttpService";
import useSWR, { mutate } from "swr";

export const useOwnerForAuth0Sub = (user) => {
  const options = { revalidateOnFocus: false, revalidateOnReconnect: false };
  const fetcher = (url) => http.get(url).then((res) => res.data.data);

  // https://swr.vercel.app/docs/conditional-fetching#dependent
  const { data, mutate, error } = useSWR(
    () => getOwnerDataAuth0SubAPIUrl(user.sub),
    fetcher,
    {},
    options
  );
  //console.log(data);
  // let owner;
  // if (data) {
  //   owner = data.data;
  // }
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
  console.log("Looking for user with auth0_sub [" + auth0_sub + "]");
  const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;

  // make sure scopes in the config includes email
  let ownerApiRoute = `/api/v1/owners/auth0_sub/${auth0_sub}`;
  const ownerURL = baseURL + ownerApiRoute;
  return ownerURL;
}

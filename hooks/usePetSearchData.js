import http from "../services/httpService";
import useSWR from "swr";

// Consider passing this something other than a query string.
export default function usePetSearchData(query) {
  const fetcher = (url) => http.get(url).then((res) => res.data);
  let searchURL = getSearchUrlFromRequest(query);
  const { data, error } = useSWR(searchURL, fetcher);

  return {
    pets: data,
    isLoading: !error && !data,
    isError: error,
  };
}

// build a query based on the query type
function getSearchUrlFromRequest(query) {
  const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
  let apiRoute = `/api/v1/pets-search/`;
  if (query.type && query.type === "nearby") {
    // I should have the lat and lng for the usr
    // I could try an IP lookup
    // or I could just disable the button.
    const lat = query.lat; //"41.8668662"; //41.8668662
    const lng = query.lng; //"-71.38392180000001"; //-71.38392180000001
    // TODO magic number for meters, just getting this working for now
    apiRoute = `/api/v1/pets-search/geo/lat/${lat}/lng/${lng}?meters=7000`;
  } else if (query.type && query.type === "city_state") {
    const { city, state } = getCityAndStateFromQuery(query);
    if (city !== "" && state !== "") {
      apiRoute = `/api/v1/pets-search/near/city/${city}/state/${state}`;
    }
  }

  function getCityAndStateFromQuery(query) {
    let city = "";
    let state = "";
    if (query.q && query.q !== null && query.q !== "") {
      if (query.q.split(",").length >= 2) {
        city = query.q.split(",")[0];
        state = query.q.split(",")[1].trim();
      }
    }
    if (city) {
      city = city.charAt(0).toUpperCase() + city.slice(1);
    }
    return { city, state };
  }

  return baseURL + apiRoute;
}

import axios from "axios";
import useSWR from "swr";

// this is temporary for the search results
export default function useCityData(city, state) {
  const options = { revalidateOnFocus: false, revalidateOnReconnect: false };
  const fetcher = (url) => axios.get(url).then((res) => res.data);
  const searchUrl = getCityDataApiUrl(city, state);
  const { data, error } = useSWR(searchUrl, fetcher, {}, options);

  return {
    cityData: data,
    isLoading: !error && !data,
    isError: error,
  };
}

function getCityDataApiUrl(city, state) {
  const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
  let cityDataApiRoute = `/api/v1/cities/name/${city}/state/${state}`;
  const cityDataUrl = baseURL + cityDataApiRoute;
  return cityDataUrl;
}

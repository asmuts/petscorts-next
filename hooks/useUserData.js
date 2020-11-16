import http from "../services/httpService";
import useSWR from "swr";

// I'm hoping to replace the current user tuil useFetchUser with an SWR version.
// I'd prefer that me be called more frequently to keep the session alive

export default function useUserData() {
  const options = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: false,
    dedupingInterval: 1000,
  };
  const fetcher = (url) => http.get(url).then((res) => res.data);
  const apiUrl = "/api/auth/me";
  const { data, error } = useSWR(apiUrl, fetcher, {}, options);
  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
}

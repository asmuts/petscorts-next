import http from "../util/httpService";
import useSWR from "swr";

// I'm hoping to replace the current user util useFetchUser with an SWR version.
// I'd prefer that me be called more frequently to keep the session alive
//
// In fact, I really don't like the next-auth0 stuff.
// I'm going to replace it all with next-oauth and scrap auth0
// It's not nice to work with and it's very expensive

// undocumented!
//import { cache } from "swr"
//cache.clear()
//

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

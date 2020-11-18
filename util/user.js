import React from "react";
import http from "../services/httpService";

// Use a global to save the user, so we don't have to fetch it again after page navigations
let userState;

const User = React.createContext({ user: null, loading: false });

////////////////////////////////////////////////////
// Get an access token to use for API call.
// auth0 recommendation:
// https://auth0.com/docs/tokens/token-storage
// "If the SPA backend cannot handle the API calls,
// the tokens should be stored in the SPA backend but
// the SPA needs to fetch the tokens from the backend to
// perform requests to the API.
// A protocol needs to be established between the backend and the
// SPA to allow the secure transfer of the token from the backend
// to the SPA."
export const getAccessToken = async () => {
  try {
    let res = await http.get("/api/auth/access-token");
    let accessToken = res.status === 200 ? res.data.access_token : null;
    return accessToken;
  } catch (error) {
    if (error.response.status === 401) {
      console.log(error);
      throw error;
    }
  }
};
////////////////////////////////////////////////////

// TODO might want to make this configurable.
// Just trying to force an occasional refresh
// Otherwise it gloms onto the old value forever
const lessThanOneHourAgo = (date) => {
  const HOUR = 1000 * 60 * 60;
  const anHourAgo = Date.now() - HOUR;
  return date > anHourAgo;
};

////////////////////////////////////////////////////
// Get the user data from the me API
export const fetchUser = async () => {
  if (userState !== undefined) {
    const stale = lessThanOneHourAgo(new Date(userState.updated_at));
    if (!stale) {
      console.log("userState is NOT stale " + +userState.updated_at);
      return userState;
    } else {
      console.log("userState is stale " + +userState.updated_at);
    }
  }
  try {
    let res = await http.get("/api/auth/me");
    userState = res.status === 200 ? res.data : null;
    //console.log("userState = " + userState);
  } catch (error) {
    if (error.response.status === 401) {
      userState = null;
    }
  }
  return userState;
};
////////////////////////////////////////////////////

export const UserProvider = ({ value, children }) => {
  const { user } = value;

  // If the user was fetched in SSR add it to userState so we don't fetch it again
  React.useEffect(() => {
    if (!userState && user) {
      userState = user;
    }
  }, []);

  return <User.Provider value={value}>{children}</User.Provider>;
};

export const useUser = () => React.useContext(User);

// The HOOK
export const useFetchUser = () => {
  const [data, setUser] = React.useState({
    user: userState || null,
    loading: userState === undefined,
  });

  React.useEffect(() => {
    if (userState !== undefined) {
      return;
    }

    let isMounted = true;

    fetchUser().then((user) => {
      // Only set the user if the component is still mounted
      if (isMounted) {
        setUser({ user, loading: false });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [userState]);

  return data;
};

import auth0 from "../../../lib/auth0";

// TODO make a switch statement and call methods for each
//
// I consolidated login, logout, signup, me, and callback
// to reduce the # of serveless funtions.
// Made an access token retrieval
//
// https://github.com/auth0/nextjs-auth0
export default async function handler(req, res) {
  const {
    query: { method },
  } = req;

  // used by the utils/user.js
  if (method === "me") {
    console.log("me called");
    try {
      await auth0.handleProfile(req, res);
    } catch (error) {
      console.error("me: " + error);
      res.status(error.status || 500).end(error.message);
    }
  }

  // Allows the client to get an access token to use for API calls.
  // auth0 recommendation:
  // https://auth0.com/docs/tokens/token-storage
  if (method === "access-token") {
    //console.log("access-token called");
    try {
      const tokenCache = auth0.tokenCache(req, res);
      // const { accessToken } = await tokenCache.getAccessToken({
      //   scopes: ["edit:pets"],
      // });
      const { accessToken } = await tokenCache.getAccessToken({
        scopes: ["email"],
      });
      return res.json({ access_token: accessToken });
    } catch (error) {
      console.error("access: " + error);
      //access: error.code invalid_session
      //access: error.name AccessTokenError
      //access: error.message The user does not have a valid session.
      if (
        error.name.includes("AccessTokenError") ||
        error.code.includes("invalid_session")
      ) {
        return res.status(401).end(error.toString());
      }
      return res.status(error.status || 500).end(error.message);
    }
  }

  // Auth0 calls this after login.
  // This has to be configured on Auth) as an allowed url
  if (method === "callback") {
    console.log("Callback called");
    try {
      //await auth0.handleCallback(req, res);
      await auth0.handleCallback(req, res, {
        onUserLoaded: async (req, res, session, state) => {
          console.log(state);
          return {
            ...session,
          };
        },
      });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).end(error.message);
    }
  }

  if (method === "login") {
    console.log("Login called");

    await auth0.handleLogin(req, res, {
      getState: (req) => {
        let redirectTo =
          req.query && req.query.redirectTo ? req.query.redirectTo : "/";
        if (req.query && req.query.redirectTo)
          return {
            someValue: "123", // testing
            redirectTo: redirectTo,
          };
      },
    });
  }

  // just setting a different redirect for owner logins
  if (method === "login-owner") {
    console.log("Login-owner called");
    await auth0.handleLogin(req, res, {
      redirectTo: "/owner",
    });
  }

  // different route for renter logins during booking
  // Perhaps redirectTo as a query param works now?
  // It didn't on the older version.
  // I'd like to pass the pet id and the start and end dates
  // across the auth path
  if (method === "login-renter-book") {
    console.log("Login-renter-book called");
    console.log(req.query);
    await auth0.handleLogin(req, res, {
      getState: (req) => {
        return {
          petId: req.query.petId,
          startAt: req.query.startAt,
          endAt: req.query.endAt,
          redirectTo:
            "/book?petId=" +
            req.query.petId +
            "&startAt=" +
            req.query.startAt +
            "&endAt=" +
            req.query.endAt,
        };
      },
    });
  }

  if (method === "signup") {
    try {
      await auth0.handleLogin(req, res, {
        authParams: {
          screen_hint: "signup", // this should prompt the signup screen
        },
      });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).end(error.message);
    }
  }

  if (method === "logout") {
    console.log("Logout");
    try {
      await auth0.handleLogout(req, res, { redirectTo: "/" });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).end(error.message);
    }
  }

  //TODO handle unknown method
  //res.send("");
}

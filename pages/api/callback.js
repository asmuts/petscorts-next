import auth0 from "../../lib/auth0";

export default async function callback(req, res) {
  try {
    // TODO redirect to signup page if login count is 1 . . .
    // need to create the user. . .
    // docs: https://github.com/auth0/nextjs-auth0
    //await auth0.handleCallback(req, res, { redirectTo: "/" });

    console.log("callback");

    await auth0.handleCallback(req, res, {
      onUserLoaded: async (req, res, session, state) => {
        console.log("onUserLoaded, state " + state, +" req " + req);
      },
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}

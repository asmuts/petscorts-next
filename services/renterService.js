import httpAuth from "../util/authHttpService";

// This should handle the create renter process
// Moving this out of the renter.js

// There's a chance given auth0 that the renter could
// exist under another sub with the same email.
// That won't work. Email is unique here.
// The user has probably mistakenly used a different sub
// Notify the user that they've logged in differently before.
// And don't create a new Onwer.

// see if we have a user for this email.
export const getRenterForEmail = async (email) => {
  return await callAPIGetRenterForEmail(email);
};

// Create an renter record for the auth0 user
export const createRenter = async (user) => {
  return await callAPIcreateRenter(user);
};

//////////////////////////////////

async function callAPIGetRenterForEmail(email) {
  let foundRenter;
  //console.log("RenterService. callAPIGetRenterForEmail [" + email + "]");
  const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;

  // make sure scopes in the config includes email
  let renterApiRoute = `/api/v1/renters/email/${email}`;
  const URL = baseURL + renterApiRoute;
  try {
    const res = await httpAuth.get(URL);
    console.log("Status: " + res.status);
    if (res.status === 200) {
      console.log("RenterService. Found renter data: " + res.data);
      foundRenter = res.data.data;
      //setRenter(foundRenter);
      return { renter: foundRenter };
    }
    // won't happen axios throws
    // if (res.status === 404) {
    //   //console.log("RenterService. Got a 404 from get renter for email");
    //   return { err: "No renter found for email. 404." };
    // }
    //throw new Error("Error"); // TODO
  } catch (e) {
    console.log(`RenterService. Error calling ${URL}`);
    return { err: e.message };
  }
}

async function callAPIcreateRenter(user) {
  let renterNew = {
    username: user.nickname,
    fullname: user.name,
    email: user.email,
    auth0_sub: user.sub,
  };
  const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
  let renterApiRoute = `/api/v1/renters/`;
  const URL = baseURL + renterApiRoute;
  try {
    const resRenter = await httpAuth.post(URL, renterNew);
    //console.log("Renter data: " + resRenter.data);
    // I might just get the id back
    if (resRenter.data) {
      renterNew._id = resRenter.data.renterId;
      //setRenter(ownerNew);
    }
    return { renter: renterNew };
  } catch (e) {
    //console.log(e, `Error creating renter ${URL}`);
    return { err: e.message };
  }
}

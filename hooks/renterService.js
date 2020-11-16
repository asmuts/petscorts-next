import http from "../services/authHttpService";

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
  console.log("RenterService. callAPIGetRenterForEmail [" + email + "]");
  const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;

  // make sure scopes in the config includes email
  let ownerApiRoute = `/api/v1/owners/email/${email}`;
  const ownerURL = baseURL + ownerApiRoute;
  try {
    const res = await http.get(ownerURL);
    //console.log("Status: " + res.status);
    if (res.status === 200) {
      //console.log("RenterService. Found renter data: " + res.data);
      foundRenter = res.data;
      //setRenter(foundRenter);
      return { renter: foundRenter };
    }
    // won't happen axios throws
    if (res.status === 404) {
      //console.log("RenterService. Got a 404 from get renter for email");
      return { err: "No renter found for email" };
    }
    throw new Error("Error"); // TODO
  } catch (e) {
    console.log(`RenterService. Error calling ${ownerURL}`);
    return { err: e.message };
  }
}

async function callAPIcreateRenter(user) {
  let ownerNew = {
    username: user.nickname,
    fullname: user.name,
    email: user.email,
    auth0_sub: user.sub,
  };
  const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
  let ownerApiRoute = `/api/v1/owners/`;
  const ownerURL = baseURL + ownerApiRoute;
  try {
    const resRenter = await http.post(ownerURL, ownerNew);
    //console.log("Renter data: " + resRenter.data);
    // I might just get the id back
    if (resRenter.data) {
      ownerNew._id = resRenter.data.ownerId;
      //setRenter(ownerNew);
    }
    return { renter: ownerNew };
  } catch (e) {
    //console.log(e, `Error creating renter ${ownerURL}`);
    return { err: e.message };
  }
}

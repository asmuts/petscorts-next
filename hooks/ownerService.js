import http from "../services/authHttpService";

// This should handle the create owner process
// Moving this out of the owner.js

// There's a chance given auth0 that the owner could
// exist under another sub with the same email.
// That won't work. Email is unique here.
// The user has probably mistakenly used a different sub
// Notify the user that they've logged in differently before.
// And don't create a new Onwer.

// see if we have a user for this email.
export const getOwnerForEmail = async (email) => {
  return await callAPIGetOwnerForEmail(email);
};

// Create an owner record for the auth0 user
export const createOwner = async (user) => {
  return await callAPIcreateOwner(user);
};

//////////////////////////////////

async function callAPIGetOwnerForEmail(email) {
  let foundOwner;
  console.log("OwnerService. callAPIGetOwnerForEmail [" + email + "]");
  const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;

  // make sure scopes in the config includes email
  let ownerApiRoute = `/api/v1/owners/email/${email}`;
  const ownerURL = baseURL + ownerApiRoute;
  try {
    const res = await http.get(ownerURL);
    //console.log("Status: " + res.status);
    if (res.status === 200) {
      //console.log("OwnerService. Found owner data: " + res.data);
      foundOwner = res.data;
      //setOwner(foundOwner);
      return { owner: foundOwner };
    }
    // won't happen axios throws
    if (res.status === 404) {
      //console.log("OwnerService. Got a 404 from get owner for email");
      return { err: "No owner found for email" };
    }
    throw new Error("Error"); // TODO
  } catch (e) {
    console.log(`OwnerService. Error calling ${ownerURL}`);
    return { err: e.message };
  }
}

async function callAPIcreateOwner(user) {
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
    const resOwner = await http.post(ownerURL, ownerNew);
    //console.log("Owner data: " + resOwner.data);
    // I might just get the id back
    if (resOwner.data) {
      ownerNew._id = resOwner.data.ownerId;
      //setOwner(ownerNew);
    }
    return { owner: ownerNew };
  } catch (e) {
    //console.log(e, `Error creating owner ${ownerURL}`);
    return { err: e.message };
  }
}

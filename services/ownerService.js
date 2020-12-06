import http from "../util/authHttpService";

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

// Get the owner by the sub
export const getOwnerForAuth0Sub = async (sub) => {
  return await callAPIgetOwnerForAuth0Sub(sub);
};

//////////////////////////////////

async function callAPIGetOwnerForEmail(email) {
  if (!email) {
    return { err: "No email provided." };
  }

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
      console.log("OwnerService. Found owner data: " + res.data);
      foundOwner = res.data.data.owner;
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
    if (resOwner.data) {
      const newOwner = resOwner.data.owner;
      return { owner: newOwner };
    }
  } catch (e) {
    console.log(e, `Error creating owner ${ownerURL}`);
    return { err: e.message };
  }
}

async function callAPIgetOwnerForAuth0Sub(auth0_sub) {
  if (!auth0_sub) {
    return { err: "No auth0_sub provided." };
  }

  let foundOwner;
  //console.log("OwnerService. callAPIgetOwnerForAuth0Sub [" + auth0_sub + "]");
  const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;

  let ownerApiRoute = `/api/v1/owners/auth0_sub/${auth0_sub}`;
  const ownerURL = baseURL + ownerApiRoute;
  try {
    const res = await http.get(ownerURL);
    //console.log("Status: " + res.status);
    if (res.status === 200) {
      //console.log("OwnerService. Found owner for auth0 sub " + auth0_sub);
      //console.log(res.data);
      //console.log(res.data.data);
      foundOwner = res.data.data;
      return { owner: foundOwner };
    }
    // won't happen axios throws
    if (res.status === 404) {
      //console.log("OwnerService. Got a 404 from get owner for sub");
      return { err: "No owner found for sub" };
    }
  } catch (e) {
    console.log(`OwnerService. Error calling ${ownerURL}`);
    return { err: e.message };
  }
}

import httpAuth from "../services/authHttpService";
import http from "../services/httpService";

export const getPet = async (petId) => {
  if (!petId) return { err: "No petID supplied." };
  const PET_SEARCH_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
  const url = `${PET_SEARCH_URI}/api/v1/pets-search/${petId}`;
  try {
    const res = await http.get(url);
    if (res.status === 200) {
      let pet = res.data.data;
      return { pet };
    } else {
      // TODO handle error
      // axios throws for anything other than 200
    }
  } catch (e) {
    console.log(e, `Error calling ${url}`);
    return { err: e.message };
  }
};

// TODO make values more explicit
export const updatePet = async (petId, values) => {
  const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
  const apiURL = `${baseURL}/api/v1/pets/${petId}`;
  try {
    const res = await httpAuth.put(apiURL, values);
    // TODO handle errors
    const petId = res.data.data;
    return { petId: petId };
  } catch (e) {
    console.log(e, `Error calling ${apiURL}`);
    return { err: e.message };
  }
};

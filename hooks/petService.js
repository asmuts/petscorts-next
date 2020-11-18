import httpAuth from "../services/authHttpService";
import http from "../services/httpService";

export const getPet = async (petId) => {
  //console.log(petId);
  if (!petId) return { err: "No petID supplied." };
  const PET_SEARCH_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
  const url = `${PET_SEARCH_URI}/api/v1/pets-search/${petId}`;
  try {
    const res = await http.get(url);
    if (res.status === 200) {
      let pet = res.data.data;
      //console.log(pet);
      return { pet };
    } else {
      //console.log("impossible");
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
  console.log("updatePet. petId = " + petId);
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

export const deleteImage = async (petId, imageId) => {
  //ex. localhost:3001/api/v1/pets/5f8c8f59165a4c1fac20104e/image/5f97128a9741a9345cfdf8b5
  const PET_SEARCH_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
  const url = `${PET_SEARCH_URI}/api/v1/pets/${petId}/image/${imageId}`;
  try {
    const res = await httpAuth.delete(url);
    if (res.status === 200) {
      const { pet, image } = res.data.data;
      //console.log("Deleted image for pet." + pet);
      return { pet, image };
    }
    // TODO handle error
  } catch (e) {
    console.log(e, `Error calling ${url}`);
    return { err: e.message };
  }
};

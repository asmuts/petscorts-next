import httpAuth from "../util/authHttpService";

export const archivePet = async (petId) => {
  const PET_SEARCH_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
  const url = `${PET_SEARCH_URI}/api/v1/pets/${petId}`;
  try {
    const res = await httpAuth.delete(url);
    if (res.status === 200) {
      pet = res.data;
      console.log("Archived pet.");
      return { pet };
    }
    return { err: res.data.error };
  } catch (e) {
    console.log(e, `Error calling ${url}`);
    return { err: e.message };
  }
};

export const reActivatePet = async (petId) => {
  const PET_SEARCH_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
  const url = `${PET_SEARCH_URI}/api/v1/pets/activate/${petId}`;
  try {
    const res = await httpAuth.put(url);
    if (res.status === 200) {
      pet = res.data.data;
      console.log("Activated pet.");
      return { pet };
    }
    return { err: res.data.error };
  } catch (e) {
    console.log(e, `Error calling ${url}`);
    return { err: e.message };
  }
};

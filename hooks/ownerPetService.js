import http from "../services/authHttpService";

// I'm going to move all data access into services

export const archivePet = async (petId) => {
  const PET_SEARCH_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
  const url = `${PET_SEARCH_URI}/api/v1/pets/${petId}`;
  try {
    const res = await http.delete(url);
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
  // TODO not implemented yet
  return {};
};

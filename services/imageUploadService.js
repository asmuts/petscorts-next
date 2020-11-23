import http from "../util/authHttpService";

export const uploadImage = async (canvasBlob, imageName, petId) => {
  // This should be in a service
  const formData = await makeFormToSubmit(canvasBlob, imageName, petId);

  const config = {
    headers: {
      "content-type": "multipart/form-data",
      enctype: "multipart/form-data",
    },
  };

  const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
  const apiURL = `${baseURL}/api/v1/upload`;
  try {
    const res = await http.post(apiURL, formData, config);
    if (res.status === 200) {
      console.log(res.data);
      let imageUrl = res.data;
      console.log(`Added image ${imageUrl} for pet. ${petId}`);
      return { imageUrl };
    }
  } catch (e) {
    console.log(e, `Error calling ${apiURL}`);
    return { err: e.message };
  }
};

// Multer s3 can't handle the dataUrl.  I need a form
const makeFormToSubmit = async (canvasBlob, imageName, petId) => {
  let imageFile = new File([canvasBlob], imageName, {
    type: "image/jpeg",
  });
  //console.log("imageFile size " + imageFile.size);

  // make a new form to submit
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("petId", petId);
  return formData;
};

// // Since I'm converting everything to jpg, I need to adjust the extension.
// const getImageName = () => {
//   const full = image.name.toLowerCase();
//   const name = full.substring(0, full.lastIndexOf(".")) + ".jpg";
//   return name;
// };

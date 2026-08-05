import api from "./api";

export const getSignatureForUpload = async (folder) => {
  try {
    const response = await api.post("/generateSignature/", { folder });
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response) throw error.response;
    throw error;
  }
};

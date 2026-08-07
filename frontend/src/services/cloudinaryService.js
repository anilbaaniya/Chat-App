import axios from "axios";
import { getSignatureForUpload } from "./getSignature";

export async function uploadToCloudinary(file, folder = "chatApp") {
  const { timestamp, signature } = await getSignatureForUpload(folder);

  if (!timestamp || !signature) {
    throw new Error("Failed to get upload signature.");
  }

  const data = new FormData();

  data.append("file", file);
  data.append("timestamp", timestamp);
  data.append("signature", signature);
  data.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
  data.append("folder", folder);

  try {
    const cloudName = import.meta.env.VITE_CLOUD_NAME;
    const resourceType = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
        ? "video"
        : "raw";

    const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const res = await axios.post(api, data);
    return res.data.secure_url;
  } catch (error) {
    console.log(error.response?.data);
    throw error;
  }
}

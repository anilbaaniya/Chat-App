import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

export const generateSignature = async (req, res, next) => {
  // accept folder from either JSON body or query string
  const folder = req.body?.folder || req.query?.folder;

  if (!folder) {
    return res.status(400).json({ message: "Folder name is required." });
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUD_API_SECRET,
    );
    return res.status(200).json({ timestamp, signature });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to generate signature", error: error.message });
  }
};

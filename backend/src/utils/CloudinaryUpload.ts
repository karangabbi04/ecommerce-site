import fs from "fs";
import cloudinary from "../lib/cloudinary";

export const uploadToCloudinary = async (
  localFilePath: string,
  folder = "ecocraft/products"
) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "image",
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    fs.unlinkSync(localFilePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    throw error;
  }
};
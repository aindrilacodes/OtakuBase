import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";
import { CLOUDNAME, CLOUDAPIKEY, CLOUDAPISECRET } from "../../envAccess.js";

const uploadOnCloudinary = (function () {
  cloudinary.config({
    cloud_name: CLOUDNAME,
    api_key: CLOUDAPIKEY,
    api_secret: CLOUDAPISECRET,
  });

  return async function (localFilePath) {
    try {
      if (!localFilePath) {
        return null;
      }
      const uploadResult = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
        folder: "anime_posters",
      });
      console.log("File is uploaded on Cloudinary", uploadResult.url);
      if (fs.existsSync(localFilePath)) {
        try {
          fs.unlinkSync(localFilePath);
          console.log("Temp file deleted:", localFilePath);
        } catch (err) {
          console.error("Error deleting temp file:", err);
        }
      }

      return uploadResult;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      if (fs.existsSync(localFilePath)) {
        try {
          fs.unlinkSync(localFilePath);
        } catch (cleanupError) {
          console.error(
            "Failed to delete temp file during error handling:",
            cleanupError
          );
        }
      }

      throw error;
    }
  };
})();

export { uploadOnCloudinary };

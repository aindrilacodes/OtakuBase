import { CLOUDNAME, CLOUDAPIKEY, CLOUDAPISECRET } from "../../envAccess.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: CLOUDNAME,
  api_key: CLOUDAPIKEY,
  api_secret: CLOUDAPISECRET,
});

export default cloudinary;

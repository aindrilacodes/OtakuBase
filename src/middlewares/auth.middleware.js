import AsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { TOKENSECRETKEY } from "../../envAccess.js";
import ApiError from "../helpers/customError.js";
import User from "../models/user.model.js";

const verifyUserToken=AsyncHandler(async(req,_,next)=>{
   const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")   ;
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, TOKENSECRETKEY);
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Invalid  user access token or token expired"
    );
  }
  const user = await User.findOne({email:decodedToken.email});

  if (!user) {
    throw new ApiError(401, "Invalid access token");
    
  }
  const userResponse = user.toObject();
  delete userResponse.password; 
  delete userResponse._id;   
  delete userResponse.createdAt;  
  delete userResponse.updatedAt;  
  delete userResponse.__v;  
  
  req.user = userResponse;
 // console.log(userResponse);
  
  next();
})

export default verifyUserToken
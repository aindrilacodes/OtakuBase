import ApiError from "../helpers/customError.js";
import User from "../models/user.model.js";
import AsyncHandler from "express-async-handler";
import ApiResponse from "../helpers/apiResponse.js"

const options = {
  httpOnly: true,
  secure: true, 
};

const registerUser = AsyncHandler(async (req, res) => {
  const { name, role, email, password } = req.body;

  if (!email || !password || !name || !role){
    throw new ApiError(400, "All fields Required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  
  const user = await User.create({
    name:name?.toLowerCase(),
    email,
    password,
   role,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -_id"
  );
  
  
  if (!createdUser) {
    throw new ApiError(500, "Internal Server Error while registering the user");
  }
  const token = await createdUser.generateUserAccessToken();

  
  if (!token) throw new ApiError(400, "Error while generating token!");
  
  return res
  .status(201)
  .cookie("accessToken", token, options)
  .json(new ApiResponse(createdUser, "User registered successfully"));
});
const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "All fields required!");

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Invalid login credentials!User does not exist");
  }

  const isPasswordValid = await user.passwordValidityCheck(password);
  if (!isPasswordValid)
    throw new ApiError(401, "Invalid login credentials! Password Incorrect");
  const token = await user.generateUserAccessToken();
  if (!token) throw new ApiError(400, "Error while generating token!");
  const userResponse = user.toObject();
  delete userResponse.password; 
  delete userResponse._id;     
  return res
  .status(201)
  .cookie("accessToken", token, options)
  .json(new ApiResponse(userResponse, "User logged in successfully"));
});

const logout = AsyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "User logged out"));
});

export { login, logout,registerUser };

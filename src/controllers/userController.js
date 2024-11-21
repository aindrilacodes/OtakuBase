import ApiError from "../helpers/customError.js";
import User from "../models/user.model.js";
import AsyncHandler from "express-async-handler";
import verifyUserToken from "../middlewares/auth.middleware.js";
import ApiResponse from "../helpers/apiResponse.js";
import Review from "../models/review.model.js";

const findUser = AsyncHandler(async (getuser) => {
  const searchedUser = await User.findOne({ email: getuser }).select(
    "-password -__v -createdAt -updatedAt "
  );
  if (!searchedUser) throw new ApiError(404, "No user found!");
  return searchedUser;
});

export const getProfileController = AsyncHandler(async (req, res) => {
  const getuser = req.user.email;
  const foundUser = await findUser(getuser);
  const response = foundUser.toObject();
  delete response._id;
  res.status(200).json(new ApiResponse(response, "User returned successful"));
});
export const updatePassword = AsyncHandler(async (req, res) => {
  const { oldpassword, newpassword } = req.body;
  const findemail = req.user.email;
  if (!oldpassword || !newpassword)
    throw new ApiError(400, "Enter oldpassword and newpassword both!");
  const existingUser = await User.findOne({ email: findemail });
  if (!existingUser) {
    throw new ApiError(403, "Unauthorized access");
  }
  const isPasswordValid = await existingUser.passwordValidityCheck(oldpassword);
  if (!isPasswordValid)
    throw new ApiError(401, "Password Incorrect!Try again!!");
  existingUser.password = newpassword;
  const pass = await existingUser.save({ validateBeforeSave: true });
  console.log(pass);

  return res
    .status(200)
    .json(new ApiResponse({}, "Password changed successfully"));
});
export const getMyReviews = AsyncHandler(async (req, res) => {
  const getuser = req.user.email;
  const foundUser = await findUser(getuser);
  const reviewslist = foundUser.toObject();
  delete reviewslist.email;
  delete reviewslist.name;
  delete reviewslist.role;
  delete reviewslist._id;
  const myreviews = [];

  for (const reviewId of reviewslist.reviews) {
    const review = await Review.findById(reviewId)
      .select("-reviewedBy -createdAt -updatedAt -__v ")
      .populate("anime", "anime_Name -_id");
    myreviews.push(review);
  }

  reviewslist.reviews = myreviews;

  res
    .status(200)
    .json(
      new ApiResponse(
        reviewslist,
        `${foundUser.name} reviews returned successfully`
      )
    );
});
export const updateUser = AsyncHandler(async (req, res) => {
  const useremail = req.user.email;
  const updateoptions = { new: true, runValidators: true };
  const getuser = await findUser(req.user.email);
  if (getuser.email !== useremail && getuser.role === "User")
    throw new ApiError(403, "Unauthorized user or invalid user");
  let updates = {};
  if (req.body.email || req.body.role)
    throw new ApiError(
      400,
      "Information like email and role cannot be updated!"
    );
  if (req.body.name) updates.name = req.body.name;

  const updatedUser = await User.findByIdAndUpdate(
    getuser._id,
    updates,
    updateoptions
  ).select("-__v -createdAt -updatedAt -_id -password ");
  if (!updatedUser) {
    throw new ApiError(500, "User updation failed!");
  }
  res
    .status(200)
    .json(new ApiResponse(updatedUser, "User updated successfully"));
});
export const deleteUser = AsyncHandler(async (req, res) => {
  const getuser = req.user.email;
  const foundUser = await findUser(getuser);
  const deleteduser = await User.findByIdAndDelete(foundUser._id);
  if (!deleteduser) throw new ApiError(500, "User deletion unsuccessful");
  res.status(200).json(new ApiResponse({}, "User deleted successfully"));
});
export const getAllUsers = AsyncHandler(async (req, res) => {
  const search = req.query.search || "";
  const limit = parseInt(req.query.limit) || 10;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const sortBy = req.query.sortBy || "_id";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1 || 1;

  const searchRegExp = new RegExp(".*" + search + ".*", "i");

  const filter = {
    role: { $ne: "Admin" },
    $or: [
      { name: { $regex: searchRegExp } },
      { role: { $regex: searchRegExp } },
    ],
  };

  let userQuery = User.find(filter)
    .select("-__v -createdAt -updatedAt -_id")
    .sort({ [sortBy]: sortOrder });

  const skip = (page - 1) * limit;
  userQuery = userQuery.skip(skip).limit(limit);

  const userslist = await userQuery;

  const totalusers = await User.countDocuments(filter);

  if (!userslist || userslist.length === 0)
    throw new ApiError(404, "No users found");

  const pagination = page
    ? {
        limit,
        totalPages: Math.ceil(totalusers / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(totalusers / limit) ? page + 1 : null,
      }
    : undefined;

  res.status(200).json({
    success: true,
    Totalcount: totalusers,
    data: userslist,
    pagination: pagination,
  });
});

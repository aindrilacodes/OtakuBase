import ApiError from "../helpers/customError.js";
import User from "../models/user.model.js";
import AsyncHandler from "express-async-handler";
import Anime from "../models/anime.model.js";
import ApiResponse from "../helpers/apiResponse.js";
import Review from "../models/review.model.js";

export const addReview = AsyncHandler(async (req, res) => {
  const animeId = req.params.animeId;
  const givenBy = req.user.email;
  const { rating, comment } = req.body;
  if (!animeId || !givenBy) {
    throw new ApiError(400, "Missing animeId or reviewed user");
  }
  if (!rating) {
    throw new ApiError(400, "Anime rating missing");
  }
  const reviewedUser = await User.findOne({ email: givenBy });

  if (!reviewedUser) throw new ApiError(400, "No such user found!");
  const newreview = await Review.create({
    anime: animeId,
    reviewedBy: reviewedUser._id,
    rating,
    comment,
  });

  const userInfo = await User.findByIdAndUpdate(reviewedUser._id, {
    $push: { reviews: newreview._id },
  });
  const animeInfo = await Anime.findByIdAndUpdate(animeId, {
    $push: { reviews: newreview._id },
  });
  const reviewResponse = {
    reviewId: newreview._id,
    DoneBy: userInfo.name,
    rating: newreview.rating,
    comment: newreview.comment,
  };

  return res
    .status(201)
    .json(new ApiResponse(reviewResponse, "Review submitted successfully!"));
});
export const updateReview = AsyncHandler(async (req, res) => {
  if (!req.body.rating && !req.body.comment) {
    throw new ApiError(400, "No data to update provided!(Rating or comment)");
  }
  const reviewId = req.params.reviewId;
  if (!reviewId) {
    throw new ApiError(400, "Missing reviewId! Failed to update");
  }
  const retrievedReview = await Review.findById(reviewId);
  if (!retrievedReview) {
    throw new ApiError(400, "Invalid ReviewID");
  }
  console.log(retrievedReview);

  const reviewedUser = await User.findById(retrievedReview.reviewedBy);

  if (!reviewedUser || reviewedUser.email !== req.user.email)
    throw new ApiError(403, "Unauthorized User");

  let updates = {};
  if (req.body.rating) updates.rating = req.body.rating;
  if (req.body.comment) updates.comment = req.body.comment;
  const updateoptions = { new: true, runValidators: true };

  const updatedReview = await Review.findByIdAndUpdate(
    retrievedReview._id,
    updates,
    updateoptions
  );
  if (!updatedReview)
    throw new ApiError(500, "Error while updating data into database!");
  const reviewResponse = {
    reviewId: updateReview._id,
    DoneBy: updatedReview.reviewedBy,
    rating: updatedReview.rating,
    comment: updatedReview.comment,
  };

  res
    .status(200)
    .json(new ApiResponse(reviewResponse, "Review updated successfully!"));
});
export const deletedReview = AsyncHandler(async (req, res) => {
  const reviewId = req.params.reviewId;
  if (!reviewId) {
    throw new ApiError(400, "Missing reviewId! Failed to update");
  }
  const deletedReview = await Review.findByIdAndDelete(reviewId);
  if (!deletedReview) throw new ApiError(500, "Review deletion unsuccessful");
  res.status(200).json(new ApiResponse({}, "Review deleted successfully!"));
});
export const getAllReviews = AsyncHandler(async (req, res) => {
  const animeId = req.params.animeId;
  if (!animeId) throw new ApiError(400, "No amime Id found!");
  const anime = await Anime.findById(animeId);

  if (!anime) {
    throw new ApiError(404, "Anime not found!");
  }
  const reviews = await Review.find({ anime: animeId }).select("-createdAt -updatedAt -__v")
    .populate("anime", "anime_Name -_id")
    .populate("reviewedBy", "name -_id")
    .exec();
  if (!reviews.length) {
    return res.status(200).json({
      success: true,
      message: "No reviews found for this anime.",
      data: [],
    });
  }

  return res.status(200).json({
    success: true,
    data: reviews,
  });
});

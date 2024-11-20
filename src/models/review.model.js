import mongoose from "mongoose";
import User from "./user.model.js";
import Anime from "./anime.model.js";

const reviewSchema = new mongoose.Schema(
  {
   anime:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Anime"
   },
    reviewedBy: {
      type:mongoose.Schema.Types.ObjectId,
    ref:"User"
    },
    rating:{
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment:{
        type:String,
    }
  },
  { timestamps: true }
);

const Review= mongoose.model("Review", reviewSchema);

export default Review;

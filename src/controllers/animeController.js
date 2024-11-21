import Anime from "../models/anime.model.js";
import AsyncHandler from "express-async-handler";
import ApiError from "../helpers/customError.js";
import ApiResponse from "../helpers/apiResponse.js";
import { uploadOnCloudinary } from "../helpers/cloudinaryHelper.js";
import cloudinary from "../config/cloudinary.config.js";
const addAnime = AsyncHandler(async (req, res) => {
  const {
    anime_Name,
    category,
    total_seasons,
    description,
    release_Year,
    sub_genre,
    genre,
    directed_by,
    duration,
  } = req.body;

  if (
    !anime_Name ||
    !category ||
    !description ||
    !release_Year ||
    !sub_genre ||
    !genre
  ) {
    return next(new ApiError(400, "All fields required!"));
  }

  const Poster = req.file?.path;
  if (!Poster) {
    throw new ApiError(400, "Poster image is required");
  }
  console.log(Poster);
  const poster = await uploadOnCloudinary(Poster);
  if (!poster) {
    throw new ApiError(500, "Error uploading poster to Cloudinary");
  }

  let anime_details = {
    anime_Name,
    category,
    description,
    release_Year,
    sub_genre,
    genre,
    poster: {
      url: poster.secure_url,
      uploadedBy: req.user?.name || "Anonymous",
      public_id: poster.public_id,
    },
  };

  // Optional fields
  if (total_seasons) anime_details.total_seasons = total_seasons;
  if (directed_by) anime_details.directed_by = directed_by;
  if (duration) anime_details.duration = duration;

  const anime = await Anime.create(anime_details);

  if (!anime) {
    throw new ApiError(500, "Error in saving anime to database");
  }

  res.status(201).json(new ApiResponse(anime, "Anime Added Successfully"));
});
const updateAnime = AsyncHandler(async (req, res) => {
  const anime_id = req.params.animeid;
  if (!anime_id) throw new ApiError(400, "Anime id not provided!");
  const {
    anime_Name,
    directed_by,
    duration,
    description,
    genre,
    sub_genre,
    category,
    total_seasons,
    release_Year,
  } = req.body;
  const updateFields = {};

  if (req.file?.path) {
    const Poster = req.file.path;
    if (!Poster) throw new ApiError(400, "No image provided for updation");
    const anime = await Anime.findById(anime_id);
    if (!anime) throw new ApiError(404, "Anime not found");

    
    //deleting old poster from cloudinary
    if (anime.poster?.public_id) {
      await cloudinary.uploader.destroy(anime.poster.public_id);
      const poster = await uploadOnCloudinary(Poster);
      if (!poster || !poster.url)
        throw new ApiError(400, "Error while uploading poster: Upload failed");
      updateFields.poster = {
        url: poster.secure_url,
        uploadedBy: req.user?.name || "Anonymous",
        public_id: poster.public_id,
      };
    } else {
      const poster = await uploadOnCloudinary(Poster);
      if (!poster || !poster.url)
        throw new ApiError(400, "Error while uploading poster: Upload failed");
      updateFields.poster = {
        url: poster.secure_url,
        uploadedBy: req.user?.name || "Anonymous",
        public_id: poster.public_id,
      };
    }
  } else if (
    !anime_Name &&
    !description &&
    !directed_by &&
    !genre &&
    !sub_genre &&
    !category &&
    !duration &&
    !total_seasons &&
    !release_Year
  ) {
    throw new ApiError(400, "No fields to update present");
  }
  if (anime_Name) updateFields.anime_Name = anime_Name;
  if (genre) updateFields.genre = genre;
  if (description) updateFields.description = description;
  if (directed_by) updateFields.directed_by = directed_by;
  if (duration) updateFields.duration = duration;
  if (category) updateFields.category = category;
  if (release_Year) updateFields.release_Year = release_Year;
  if (total_seasons) updateFields.total_seasons = total_seasons;
  if (sub_genre) updateFields.sub_genre = sub_genre;
  const updatedAnime = await Anime.findByIdAndUpdate(
    anime_id,
    {
      $set: updateFields,
    },
    { new: true }
  ).select("-__v -createdAt -updatedAt -poster.public_id -poster.uploadedBy");
  if (!updatedAnime) throw new ApiError(500, "Anime updation failed!");
  res
    .status(200)
    .json(new ApiResponse(updatedAnime, "Anime updated successfully!"));
});
const deleteAnime = AsyncHandler(async (req, res) => {
  const anime_id = req.params.anime_id;
  if (!anime_id) throw new ApiError(400, "Anime id not provided!");
  const posterfordeletion = await Anime.findById(anime_id);
  if (!posterfordeletion)
    throw new ApiError(400, "Anime for deletion not found");
  const posterpublicid = await cloudinary.uploader.destroy(
    posterfordeletion.poster.public_id
  );
  console.log(posterpublicid);
  
  if (!posterpublicid)
    throw new ApiError(500, "Poster deletion from cloudinary unsuccessful!");
  const deletedAnime = await Anime.findByIdAndDelete(anime_id);

  if (!deletedAnime) {
    throw new ApiError(404, "Anime not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse({}, "Anime deleted successfully!"));
});
const getAnimeById = AsyncHandler(async (req, res) => {
  const animeid = req.params.animeid;
  if (!animeid) throw new ApiError(400, "Anime id not provided!");
  const retrivedAnime = await Anime.findById(animeid).select(
    "-__v -createdAt -updatedAt"
  );

  if (!retrivedAnime) {
    throw new ApiError(404, "Anime not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(retrivedAnime, "Anime returned successfully!"));
});

const getAnimes = AsyncHandler(async (req, res) => {
  const search = req.query.search || "";
  const limit = parseInt(req.query.limit) || 10;
  const page = req.query.page ? parseInt(req.query.page) : null;
  const sortBy = req.query.sortBy || "_id";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1 || 1;
  const searchRegExp = new RegExp(".*" + search + ".*", "i");
  const filter = {
    $or: [
      { anime_Name: { $regex: searchRegExp } },
      { genre: { $regex: searchRegExp } },
      { sub_genre: { $regex: searchRegExp } },
      { category: { $regex: searchRegExp } },
      { directed_by: { $regex: searchRegExp } },
      { release_Year: { $regex: searchRegExp } },
    ],
  };
  let animesQuery = Anime.find(filter)
    .select("-__v -createdAt -updatedAt")
    .sort({ [sortBy]: sortOrder });

  if (page && limit) {
    const skip = (page - 1) * limit;
    animesQuery = animesQuery.limit(limit).skip(skip);
  } else {
    if (!page && limit) animesQuery = animesQuery.limit(limit);
  }
  const animes = await animesQuery;

  const totalAnimes = await Anime.countDocuments(filter);
  res.status(200).json({
    success: true,
    Totalcount: totalAnimes,
    data: animes,

    pagination: page
      ? {
          page,
          limit,
          totalPages: Math.ceil(totalAnimes / limit),
        }
      : undefined,
  });
});

export { addAnime, updateAnime, deleteAnime, getAnimeById, getAnimes };

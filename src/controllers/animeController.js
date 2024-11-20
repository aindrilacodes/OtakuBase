import Anime from "../models/anime.model.js";
import AsyncHandler from "express-async-handler";
import ApiError from "../helpers/customError.js";
import ApiResponse from "../helpers/apiResponse.js";
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
    throw new ApiError(400, "All fields required!");
  }
  let anime_details = {
    anime_Name,
    category,
    description,
    release_Year,
    sub_genre,
    genre,
  };
  // console.log(anime_details);

  if (req.body.total_seasons) {
    anime_details.total_seasons = total_seasons;
  }
  if (req.body.directed_by) {
    anime_details.directed_by = directed_by;
  }
  if (req.body.duration) {
    anime_details.duration = duration;
  }

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

  if (
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
  const updateFields = {};
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
  );
  if (!updatedAnime) throw new ApiError(500, "ANime updation failed!");
  res
    .status(200)
    .json(new ApiResponse(updatedAnime, "Anime updated successfully!"));
});
const deleteAnime = AsyncHandler(async (req, res) => {
  const anime_id = req.params.anime_id;
  if (!anime_id) throw new ApiError(400, "Anime id not provided!");
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
  let animesQuery = Anime.find(filter).select("-__v -createdAt -updatedAt")
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
    Totalcount:totalAnimes,
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


export { addAnime, updateAnime, deleteAnime, getAnimeById,getAnimes };

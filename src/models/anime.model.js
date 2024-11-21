import mongoose from "mongoose";
const animeSchema = new mongoose.Schema(
  {
    anime_Name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["movie", "show"],
      required:true,
    },
    total_seasons: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Please Enter the description"],
    },
    release_Year: {
      type: String,
      required: [true, "Please Enter the year of release"],
    },
    sub_genre: {
      type: [String],
      enum: [
        "Action",
        "Comedy",
        "Drama",
        "Horror",
        "Thriller",
        "Romance",
        "Sports",
        "Fantasy"
      ],
      required: true,
    },
    genre: {
      type: [String],
      enum: [
        "Shonen",
        "Shoujo",
        "Seinen",
        "Josei",
        "Isekai",
        "Mecha",
        "Slice of Life",
        "Kodomomuke",
        "Iyashikei",
      ],
      required: true,
    },
    directed_by: {
      type: String,
    },
    poster: {
      url: { type: String, required: true },
      uploadedBy: { type: String, default: "Anonymous" },
      public_id: { type: String, required: true },
    },
    duration: {
      type: String,
    },
    reviews:[{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const Anime = mongoose.model("Anime", animeSchema);

export default Anime;

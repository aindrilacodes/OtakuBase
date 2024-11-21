import express from "express";
import morgan from "morgan";
import { PORT } from "./envAccess.js";
import authRouter from "./src/routes/authRoutes.js";
import animeRouter from "./src/routes/animeRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import connectDB from "./src/config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import ApiError from "./src/helpers/customError.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "pages")));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/anime", animeRouter);
app.use("/api/user", userRouter);

//client error handling
app.use((req, res, next) => {
  throw new ApiError(404, "Route not found!");
});

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    if (err.message === "Route not found!") {
      return res
        .status(err.status)
        .sendFile(path.join(__dirname, "pages", "404.html"));
    }
    return res.status(err.status).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    status: 500,
    message: err.message || "Internal Server Error",
  });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });

import {
  addAnime,
  deleteAnime,
  getAnimes,
  getAnimeById,
  updateAnime,
} from "../controllers/animeController.js";
import express from "express";
import verifyUserToken from "../middlewares/auth.middleware.js";
import { adminRolecheck } from "../middlewares/userRoleChecking.js";
import { addReview, deletedReview, getAllReviews, updateReview } from "../controllers/reviewController.js";
const router = express.Router();

router.route("/").post(verifyUserToken, adminRolecheck, addAnime);
router.route("/:animeid").put(verifyUserToken, adminRolecheck, updateAnime);
router.route("/:anime_id").delete(verifyUserToken, adminRolecheck, deleteAnime);
router.route("/:animeid").get(getAnimeById);
router.route("/").get(getAnimes);

//Review Routes
router.route("/:animeId/newReview").post(verifyUserToken,addReview)
router.route("/:animeId/updateReviews/:reviewId").put(verifyUserToken,updateReview)
router.route("/:animeId/deleteReview/:reviewId").delete(verifyUserToken,deletedReview)
router.route("/:animeId/allreviews").get(getAllReviews)
export default router;

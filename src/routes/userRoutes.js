import {
  deleteUser,
  getAllUsers,
  getMyReviews,
  getProfileController,
  updateUser,
} from "../controllers/userController.js";
import express from "express";
import verifyUserToken from "../middlewares/auth.middleware.js";
import { adminRolecheck } from "../middlewares/userRoleChecking.js";
const router = express.Router();

router.route("/").get(verifyUserToken, getProfileController);

router.route("/myreviews").get(verifyUserToken, getMyReviews);
router.route("/").put(verifyUserToken, updateUser);
router.route("/").delete(verifyUserToken, deleteUser);
router.route("/allusers").get(verifyUserToken, adminRolecheck, getAllUsers);

export default router;

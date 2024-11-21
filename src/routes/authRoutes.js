import { registerUser, login, logout } from "../controllers/authController.js";
import express from "express";
import verifyUserToken from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").post(verifyUserToken, logout);
export default router;

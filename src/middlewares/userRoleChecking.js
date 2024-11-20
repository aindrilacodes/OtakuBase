import AsyncHandler from "express-async-handler";
import ApiError from "../helpers/customError.js";

export const userRolecheck = AsyncHandler(async (req, _, next) => {
    if (req.user.role !== "User") {
      throw new ApiError(403, "Unauthorized user");
    }
    next();
  });
  export const adminRolecheck = AsyncHandler(async (req,_, next) => {
    if (req.user.role !== "Admin") {
      throw new ApiError(403, "Unauthorized user");
    }
    next();
  });
  
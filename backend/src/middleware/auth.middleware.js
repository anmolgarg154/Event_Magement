import { asyncHandler } from "../utils/asyn-handler.js";
import jwt from "jsonwebtoken"
import User from "../models/User.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const rawHeader = req.header("Authorization") || req.cookies?.accessToken;
    const token = rawHeader?.startsWith("Bearer ")
      ? rawHeader.slice(7).trim()
      : rawHeader?.trim();

    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({ success: false, msg: "Unauthorized request" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({ _id: decodedToken?._id });
    if (!user) {
      return res.status(401).json({ success: false, msg: "Invalid or expired session." });
    }

    await user.select("-password -refreshToken");

    req.user = user;
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: error?.message || "Invalid access token",
    });
  }
})
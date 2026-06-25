import express from "express";
import {registerUser,loginUser,forgotPassword,} from "../controllers/authController.js";
import passport from "passport";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.get( "/google",passport.authenticate(
    "google",
    {
      scope: [
        "profile",
        "email",
      ],
    }
  ));

router.get(
  "/google/callback",

  passport.authenticate(
    "google",
    {
      session: false,
    }
  ),

  async (req, res) => {

    const token =
      generateToken(
        req.user._id
      );

    res.redirect(
      `http://localhost:5173/oauth-success?token=${token}`
    );
  }
);
export default router;

import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import {
    isValidPassword,
    PASSWORD_RULE_MESSAGE,
} from "../utils/passwordRules.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!isValidPassword(password)) {
            return res.status(400).json({
                success: false,
                message: PASSWORD_RULE_MESSAGE,
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      !user.password
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Email is required",
      });
    }

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "No account found with this email",
      });
    }

    if (
      user.authProvider === "google"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google login",
      });
    }

    const temporaryPassword =
      crypto
        .randomBytes(6)
        .toString("base64url");

    user.password =
      await bcrypt.hash(
        temporaryPassword,
        10
      );

    await user.save();

    res.json({
      success: true,
      message:
        "Temporary password generated",
      temporaryPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

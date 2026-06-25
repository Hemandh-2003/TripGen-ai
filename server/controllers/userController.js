import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {
  isValidPassword,
  PASSWORD_RULE_MESSAGE,
} from "../utils/passwordRules.js";

export const getProfile = async (
  req,
  res
) => {
  try {

    const user =
      await User.findById(
        req.user._id
      ).select("-password");

    if (
      user?.profilePicture?.startsWith(
        "data:"
      )
    ) {
      user.profilePicture = "";
      await user.save();
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (
  req,
  res
) => {
  try {

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    user.name =
      req.body.name ||
      user.name;

    await user.save();

    res.json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

export const changePassword =
  async (req, res) => {

    try {
      const {
        currentPassword,
        newPassword,
        confirmPassword,
      } = req.body;

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All password fields are required",
        });
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "New password and confirm password do not match",
        });
      }

      if (!isValidPassword(newPassword)) {
        return res.status(400).json({
          success: false,
          message: PASSWORD_RULE_MESSAGE,
        });
      }

      const user =
        await User.findById(
          req.user._id
        );

      if (
        !user ||
        !user.password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Password change is only available for local accounts",
        });
      }

      const isMatch =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message:
            "Current password is incorrect",
        });
      }

      user.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      await user.save();

      res.json({
        success: true,
        message:
          "Password changed successfully",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
};

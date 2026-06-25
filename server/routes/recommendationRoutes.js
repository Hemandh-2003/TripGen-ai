import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createRecommendations,
} from "../controllers/recommendationController.js";

const router = express.Router();

router.post(
  "/ai",
  protect,
  createRecommendations
);

export default router;

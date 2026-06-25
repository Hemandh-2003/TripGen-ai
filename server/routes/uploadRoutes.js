import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { uploadDocument } from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.array("documents",10),
  uploadDocument
);

export default router;
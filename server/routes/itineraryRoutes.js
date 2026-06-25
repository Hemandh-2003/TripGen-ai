import express from "express";
import protect from "../middleware/authMiddleware.js";
import {getUserItineraries,getSharedItinerary,deleteItinerary,downloadItinerary,downloadSharedPDF} from "../controllers/itineraryController.js";

const router = express.Router();

router.get("/history",protect,getUserItineraries);
router.get("/share/:shareId",getSharedItinerary);
router.delete("/:id",protect,deleteItinerary);
router.get("/download/:id",protect,downloadItinerary);
router.get("/share/download/:shareId",downloadSharedPDF);
export default router;
import Itinerary from "../models/Itinerary.js";
import { generatePDF } from "../services/pdfGenerator.js";

export const getUserItineraries =
  async (req, res) => {
    try {
      const itineraries =
        await Itinerary.find({
          userId: req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        itineraries,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


export const getSharedItinerary = async (
  req,
  res
) => {
  try {
    const itinerary =
      await Itinerary.findOne({
        shareId: req.params.shareId,
      });

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Itinerary not found",
      });
    }

    res.json({
      success: true,
      itinerary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteItinerary = async (
  req,
  res
) => {
  try {
    const itinerary =
      await Itinerary.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message:
          "Itinerary not found",
      });
    }

    await itinerary.deleteOne();

    res.json({
      success: true,
      message:
        "Itinerary deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const downloadItinerary =
  async (req, res) => {
    try {

      const itinerary =
        await Itinerary.findOne({
          _id: req.params.id,
          userId: req.user._id,
        });

      if (!itinerary) {
        return res.status(404).json({
          success: false,
          message:
            "Itinerary not found",
        });
      }

      const trip = JSON.parse(
        itinerary.itinerary
      );

      generatePDF(
        trip,
        res
      );

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const downloadSharedPDF = async (
  req,
  res
) => {
  try {
    const itinerary =
      await Itinerary.findOne({
        shareId: req.params.shareId,
      });

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    const trip = JSON.parse(
      itinerary.itinerary
    );

    generatePDF(trip, res);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
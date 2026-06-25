import {
  generatePlannerRecommendations,
} from "../services/aiService.js";
import Itinerary from "../models/Itinerary.js";
import crypto from "crypto";

export const createRecommendations =
  async (req, res) => {
    try {
      const {
        destination,
        budget,
        days,
      } = req.body;

      if (
        !destination ||
        !budget ||
        !days
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Destination, budget, and days are required",
        });
      }

      const recommendations =
        await generatePlannerRecommendations({
          destination,
          budget,
          days,
        });

      const plannerTrip = {
        source: "ai-planner",
        destination:
          recommendations.destination ||
          destination,
        budget:
          recommendations.budget ||
          budget,
        days:
          recommendations.days ||
          days,
        summary:
          `${days}-day AI planner recommendations for ${destination} with a budget of ${budget}.`,
        recommendations: {
          placesToVisit:
            recommendations.placesToVisit ||
            [],
          restaurants:
            recommendations.restaurants ||
            [],
          travelTips:
            recommendations.travelTips ||
            [],
          budgetPlan:
            recommendations.budgetPlan ||
            [],
        },
      };

      const itinerary =
        await Itinerary.create({
          userId: req.user._id,
          itinerary:
            JSON.stringify(
              plannerTrip
            ),
          shareId:
            crypto.randomUUID(),
        });

      res.json({
        success: true,
        recommendations:
          plannerTrip,
        itinerary,
        shareUrl:
          `${process.env.CLIENT_URL}/share/${itinerary.shareId}`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

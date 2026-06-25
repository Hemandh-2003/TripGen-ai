import model from "../config/gemini.js";
import { generateWithOpenAI } from "./openaiService.js";
import {generateWithGroq,} from "./groqService.js";

export const generateItinerary = async (
  extractedText
) => {

  const prompt = `
You are a backend travel planning API.

Your job is to extract travel information, add practical trip-specific recommendations, and return VALID JSON.

IMPORTANT RULES:
- Return JSON only.
- No explanations.
- No markdown.
- No code blocks.
- Missing values must be "" or [].
- Recommendations must be based on the destination, travel dates, hotel area, guest count, and itinerary context when available.

JSON Schema:

{
  "destination": "",
  "hotel": "",
  "checkIn": "",
  "checkOut": "",
  "guests": "",
  "summary": "",
  "recommendations": {
    "placesToVisit": [],
    "restaurants": [],
    "localAttractions": [],
    "transportation": [],
    "travelTips": [],
    "bestTimeToVisit": "",
    "estimatedBudget": ""
  },
  "days": [
    {
      "day_number": 1,
      "date": "",
      "title": "",
      "activities": [
        {
          "time": "",
          "activity_title": "",
          "description": ""
        }
      ]
    }
  ]
}

Booking Information:

${extractedText}
`;

  try {

  console.log(
    "Using Gemini..."
  );

  const result =
    await model.generateContent(
      prompt
    );

  const text =
    result.response.text();

  return JSON.parse(text);

} catch (error) {

  console.log(
    "Gemini Failed:"
  );

  console.log(
    error.message
  );

  if (
    error.message?.includes(
      "503"
    ) ||
    error.message?.includes(
      "429"
    )
  ) {

    console.log(
      "Switching to Groq..."
    );

    return await generateWithGroq(
      prompt
    );
  }

  throw error;
}
};

export const generatePlannerRecommendations = async ({
  destination,
  budget,
  days,
}) => {
  const prompt = `
You are an AI travel recommendation API.

Return VALID JSON only.
No explanations.
No markdown.
No code blocks.
Missing values must be "" or [].

Create practical recommendations for this trip:
- Destination: ${destination}
- Budget: ${budget}
- Days: ${days}

JSON Schema:

{
  "destination": "",
  "budget": "",
  "days": "",
  "placesToVisit": [],
  "restaurants": [],
  "travelTips": [],
  "budgetPlan": [
    {
      "category": "",
      "amount": "",
      "notes": ""
    }
  ]
}
`;

  try {
    const result =
      await model.generateContent(
        prompt
      );

    const text =
      result.response.text();

    return JSON.parse(text);
  } catch (error) {
    if (
      error.message?.includes(
        "503"
      ) ||
      error.message?.includes(
        "429"
      )
    ) {
      return await generateWithGroq(
        prompt
      );
    }

    throw error;
  }
};

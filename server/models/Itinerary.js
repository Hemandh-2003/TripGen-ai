import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    files: [
      {
        fileUrl: String,
        fileName: String,
        fileType: String,
        uploadStatus: String,
        uploadError: String,
      },
    ],

    extractedText: String,

    itinerary: String,

    shareId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Itinerary",
  itinerarySchema
);

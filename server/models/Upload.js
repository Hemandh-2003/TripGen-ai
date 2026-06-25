import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    extractedText: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Upload = mongoose.model("Upload", uploadSchema);

export default Upload;
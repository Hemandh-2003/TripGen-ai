import { extractPDFText } from "../services/pdfService.js";
import { generateItinerary } from "../services/aiService.js";
import { extractTextFromImage } from "../services/ocrService.js";
import Itinerary from "../models/Itinerary.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import crypto from "crypto";

const getCloudinaryResourceType = (
  mimetype
) => {
  if (
    mimetype === "application/pdf"
  ) {
    return "raw";
  }

  if (
    mimetype.startsWith("image/")
  ) {
    return "image";
  }

  return "auto";
};

const uploadToCloudinary = (
  file
) =>
  new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "tripgen-ai",
          resource_type:
            getCloudinaryResourceType(
              file.mimetype
            ),
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

    uploadStream.on(
      "error",
      reject
    );

    streamifier
      .createReadStream(
        file.buffer
      )
      .pipe(uploadStream);
  });

const buildFileRecord = async (
  file
) => {
  try {
    const uploadResult =
      await uploadToCloudinary(
        file
      );

    return {
      fileUrl:
        uploadResult.secure_url,
      fileName:
        file.originalname,
      fileType:
        file.mimetype,
      uploadStatus:
        "uploaded",
    };
  } catch (error) {
    console.error(
      "Cloudinary upload failed:",
      {
        fileName:
          file.originalname,
        fileType:
          file.mimetype,
        message:
          error.message,
        httpCode:
          error.http_code,
        name:
          error.name,
      }
    );

    return {
      fileUrl: "",
      fileName:
        file.originalname,
      fileType:
        file.mimetype,
      uploadStatus:
        "failed",
      uploadError:
        error.message,
    };
  }
};

export const uploadDocument = async (
  req,
  res
) => {
  try {
    if (
      !req.files ||
      req.files.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    let extractedText = "";

    const uploadedFiles = [];

    for (const file of req.files) {
      uploadedFiles.push(
        await buildFileRecord(
          file
        )
      );

      // Extract text

      if (
        file.mimetype ===
        "application/pdf"
      ) {

        extractedText +=
          await extractPDFText(
            file.buffer
          );

        extractedText += "\n\n";

      } else if (
        file.mimetype.startsWith(
          "image/"
        )
      ) {

        extractedText +=
          await extractTextFromImage(
            file.buffer
          );

        extractedText += "\n\n";
      }
    }

    console.log(
      "Extracted Text Length:",
      extractedText.length
    );

    const itineraryData =
      await generateItinerary(
        extractedText
      );

    const itineraryDoc =
      await Itinerary.create({
        userId:
          req.user._id,

        files:
          uploadedFiles,

        extractedText,

        itinerary:
          JSON.stringify(
            itineraryData
          ),

        shareId:
          crypto.randomUUID(),
      });

    console.log(
      "Files Uploaded:",
      uploadedFiles.length
    );

    console.log(
      "ITINERARY:"
    );

    console.log(
      itineraryData
    );

    return res.status(200).json({
      success: true,
      itinerary:
        itineraryDoc,

      shareUrl:
        `${process.env.CLIENT_URL}/share/${itineraryDoc.shareId}`,
    });

  } catch (error) {

    console.error(
      "Upload failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

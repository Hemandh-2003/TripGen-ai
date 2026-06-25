import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import protect from "./middleware/authMiddleware.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import passport from "./config/passport.js";
import session from "express-session";
import userRoutes from "./routes/userRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  "/uploads",
  express.static("uploads")
);

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/itinerary",itineraryRoutes);
app.use("/api/user",userRoutes);
app.use("/api/recommendations",recommendationRoutes);

app.use(
  session({
    secret: "tripgen-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  passport.initialize()
);

app.use(
  passport.session()
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TripGen AI API Running",
  });
});
app.get(
  "/api/protected",
  protect,
  (req, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

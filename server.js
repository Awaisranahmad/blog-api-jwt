require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ blog database is connected"))
  .catch((err) => console.log("❌ database error", err.message));

// Test Route
app.get("/", (req, res) => {
  res.send("📝 blog API is running..........");
});

// ✅ Routes (Pehle routes chalte hain)
app.use("/api/auth", authRoutes);
app.use('/api/posts', postRoutes);

// =============================================
// ✅ YAHAN ERROR HANDLER ADD KAREIN 
// =============================================
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Something went wrong';

  // Mongoose CastError (Invalid ID)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format: ${err.value}. Please provide a valid 24-character MongoDB ID.`;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(e => e.message);
    message = `Validation failed: ${errors.join('. ')}`;
  }

  // JSON Response bhejein 
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Error handler ko Express mein register karein
app.use(errorHandler);

// =============================================
// Server Start (Hamesha sab se neechay)
// =============================================
app.listen(PORT, () => {
  console.log(`🚀 blog server running at http://localhost:${PORT}`);
});
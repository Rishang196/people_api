require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./config/db");
const swaggerSpec = require("./swagger");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const matchingRoutes = require("./routes/matchingRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();


// ==========================================
// DATABASE
// ==========================================

connectDB();


// ==========================================
// SECURITY
// ==========================================

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true
  })
);


// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());


// ==========================================
// GENERAL API RATE LIMITER
// ==========================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message: "Too many requests, please try again later."
  }
});


// ==========================================
// AUTH RATE LIMITER
// ==========================================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message:
      "Too many authentication attempts. Please try again later."
  }
});


// ==========================================
// GENERAL API LIMITER
// ==========================================

app.use("/api", apiLimiter);


// ==========================================
// SWAGGER DOCUMENTATION
// ==========================================

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


// ==========================================
// API ROUTES
// ==========================================

// Authentication
app.use(
  "/api/auth",
  authLimiter,
  authRoutes
);

// Users
app.use(
  "/api/users",
  userRoutes
);

// Profile
app.use(
  "/api/users",
  profileRoutes
);

// AI Matching
app.use(
  "/api/matching",
  matchingRoutes
);


// ==========================================
// ROOT ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Human API backend is running!"
  });
});


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Human API backend is healthy"
  });
});


// ==========================================
// API INFORMATION
// ==========================================

app.get("/api", (req, res) => {
  res.status(200).json({
    name: "Human API",
    version: "1.0.0",
    status: "running",
    documentation: "/api-docs"
  });
});


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(errorMiddleware);


// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT,"0.0.0.0", () => {
  console.log("----------------------------------");
  console.log("Human API backend is running");
  console.log(`Server: http://localhost:${PORT}`);
  
  console.log("----------------------------------");
});
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

// ===============================
// DATABASE
// ===============================

connectDB();

// ===============================
// SECURITY MIDDLEWARE
// ===============================

app.use(helmet());

app.use(cors());

app.use(express.json());

// ===============================
// RATE LIMITING
// ===============================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later."
  }
});

app.use("/api", apiLimiter);

// ===============================
// SWAGGER DOCUMENTATION
// ===============================

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/users", profileRoutes);

app.use("/api/matching", matchingRoutes);

// ===============================
// ROOT
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Human API backend is running!"
  });
});

// ===============================
// HEALTH CHECK
// ===============================

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     description: Returns the current health status of the Human API backend.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Human API backend is healthy
 */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Human API backend is healthy"
  });
});

// ===============================
// API INFORMATION
// ===============================

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Get API information
 *     description: Returns basic information about the Human API.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: Human API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 status:
 *                   type: string
 *                   example: running
 */
app.get("/api", (req, res) => {
  res.status(200).json({
    name: "Human API",
    version: "1.0.0",
    status: "running"
  });
});

// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// ===============================
// ERROR HANDLER
// ===============================

app.use(errorMiddleware);

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});
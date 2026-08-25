const express = require("express");

const {
  updateProfile,
  getProfile
} = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/profile", authMiddleware, getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Aman
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Python
 *                   - Django
 *                   - Machine Learning
 *               expertise:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - AI
 *                   - Machine Learning
 *               education:
 *                 type: string
 *                 example: B.Tech CSE
 *               experience:
 *                 type: string
 *                 example: 2 years software development
 *               location:
 *                 type: string
 *                 example: India
 *               portfolio:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/aman
 *               socialLinks:
 *                 type: object
 *                 properties:
 *                   linkedin:
 *                     type: string
 *                     format: uri
 *                     example: https://linkedin.com/in/aman
 *                   github:
 *                     type: string
 *                     format: uri
 *                     example: https://github.com/aman
 *                   twitter:
 *                     type: string
 *                     format: uri
 *                     example: https://twitter.com/aman
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid profile data
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
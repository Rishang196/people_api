const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  findMatches
} = require("../controllers/matchingController");

const {
  testAI
} = require("../services/aiMatchingService");

/**
 * @swagger
 * tags:
 *   name: AI Matching
 *   description: AI-powered human matching
 */

/**
 * @swagger
 * /api/matching/ai-test:
 *   get:
 *     summary: Test AI connection
 *     description: Checks whether the Gemini AI service is connected successfully.
 *     tags: [AI Matching]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI connection successful
 *       401:
 *         description: Authentication required
 *       500:
 *         description: AI connection failed
 */
router.get("/ai-test", authMiddleware, async (req, res) => {
  try {
    const result = await testAI();

    res.status(200).json({
      message: result
    });

  } catch (error) {
    console.error("AI TEST ERROR:", error);

    res.status(500).json({
      message: "AI connection failed"
    });
  }
});


/**
 * @swagger
 * /api/matching/search:
 *   get:
 *     summary: Find matching humans
 *     description: Uses AI to find and rank users based on a search query.
 *     tags: [AI Matching]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skill
 *         required: true
 *         schema:
 *           type: string
 *         description: Skill or expertise to search for
 *         example: Machine Learning
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 10
 *         description: Number of matches per page
 *
 *     responses:
 *       200:
 *         description: Matching users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 1
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 5
 *                 totalMatches:
 *                   type: integer
 *                   example: 1
 *                 matches:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 6a8ca6b463480aaf304dac1e
 *                           name:
 *                             type: string
 *                             example: Aman
 *                           skills:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example:
 *                               - Python
 *                               - Django
 *                               - Machine Learning
 *                           expertise:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example:
 *                               - AI
 *                               - Machine Learning
 *                           education:
 *                             type: string
 *                             example: B.Tech CSE
 *                           experience:
 *                             type: string
 *                             example: 2 years software development
 *                           location:
 *                             type: string
 *                             example: India
 *                           portfolio:
 *                             type: string
 *                             example: https://example.com/aman
 *                           socialLinks:
 *                             type: object
 *                       matchScore:
 *                         type: number
 *                         example: 95
 *                       reason:
 *                         type: string
 *                         example: Strong match with Machine Learning expertise.
 *
 *       400:
 *         description: Search query is missing
 *       401:
 *         description: Authentication required
 *       500:
 *         description: AI matching failed
 */
router.get("/search", authMiddleware, findMatches);


module.exports = router;
const express = require("express");
const router = express.Router();

const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User discovery and user profiles
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get users
 *     description: Get other users with optional skill and location filters.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skill
 *         schema:
 *           type: string
 *         description: Filter users by skill
 *         example: JavaScript
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter users by location
 *         example: India
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 10
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       400:
 *         description: Invalid pagination parameters
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to get users
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const {
      skill,
      location,
      page = 1,
      limit = 10
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1
    ) {
      return res.status(400).json({
        message: "Page must be a positive integer"
      });
    }

    if (
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 20
    ) {
      return res.status(400).json({
        message: "Limit must be between 1 and 20"
      });
    }

    const filter = {
      _id: {
        $ne: req.user.userId
      }
    };

    if (skill) {
      filter.skills = {
        $regex: skill,
        $options: "i"
      };
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i"
      };
    }

    const totalUsers = await User.countDocuments(filter);

    const skip =
      (pageNumber - 1) * limitNumber;

    const users = await User.find(filter)
      .select("-password -email")
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      count: users.length,
      page: pageNumber,
      limit: limitNumber,
      totalUsers,
      totalPages: Math.ceil(
        totalUsers / limitNumber
      ),
      users
    });

  } catch (error) {
    console.error("GET USERS ERROR:", error);

    res.status(500).json({
      message: "Failed to get users"
    });
  }
});


/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user
 *     description: Get a user's public profile by their ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *         example: 6a8ca6b463480aaf304dac1e
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to get user
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -email");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        skills: user.skills,
        expertise: user.expertise,
        education: user.education,
        experience: user.experience,
        location: user.location,
        portfolio: user.portfolio,
        socialLinks: user.socialLinks
      }
    });

  } catch (error) {
    console.error("GET USER ERROR:", error);

    res.status(500).json({
      message: "Failed to get user"
    });
  }
});


module.exports = router;
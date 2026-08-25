const User = require("../models/user");
const { findAIMatches } = require("../services/aiMatchingService");

const findMatches = async (req, res) => {
  try {
    const {
      skill,
      page = 1,
      limit = 10
    } = req.query;

    // Validate search query
    if (!skill || !skill.trim()) {
      return res.status(400).json({
        message: "Please provide a search query"
      });
    }

    // Validate page
    const pageNumber = Number(page);

    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
      return res.status(400).json({
        message: "Page must be a positive integer"
      });
    }

    // Validate limit
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 20
    ) {
      return res.status(400).json({
        message: "Limit must be between 1 and 20"
      });
    }

    // Get candidate users
    const users = await User.find({
      _id: { $ne: req.user.userId }
    })
      .select("-password -email")
      .limit(20);

    // No users available
    if (users.length === 0) {
      return res.status(200).json({
        count: 0,
        page: pageNumber,
        limit: limitNumber,
        totalMatches: 0,
        matches: []
      });
    }

    // Ask Gemini for AI matches
    const aiResult = await findAIMatches(skill.trim(), users);

    // Validate AI response
    if (
      !aiResult ||
      !Array.isArray(aiResult.matches)
    ) {
      return res.status(500).json({
        message: "Invalid AI matching response"
      });
    }

    // Convert AI results into safe API results
    const matches = aiResult.matches
      .map((match) => {
        const user = users.find(
          (u) => u._id.toString() === String(match.id)
        );

        if (!user) {
          return null;
        }

        let score = Number(match.matchScore);

        // Protect against invalid AI scores
        if (!Number.isFinite(score)) {
          score = 0;
        }

        score = Math.max(0, Math.min(100, score));

        return {
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
          },
          matchScore: score,
          reason:
            typeof match.reason === "string"
              ? match.reason
              : "AI-generated match"
        };
      })
      .filter(Boolean);

    // Highest score first
    matches.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    // Only show good matches
    const minimumScore = 70;

    const filteredMatches = matches.filter(
      (match) => match.matchScore >= minimumScore
    );

    // Pagination
    const startIndex =
      (pageNumber - 1) * limitNumber;

    const paginatedMatches =
      filteredMatches.slice(
        startIndex,
        startIndex + limitNumber
      );

    // Final response
    res.status(200).json({
      count: paginatedMatches.length,
      page: pageNumber,
      limit: limitNumber,
      totalMatches: filteredMatches.length,
      matches: paginatedMatches
    });

  } catch (error) {
    console.error(
      "AI MATCHING ERROR:",
      error
    );

    res.status(500).json({
      message: error.message || "AI matching failed"
    });
  }
};

module.exports = {
  findMatches
};
const User = require("../models/user");
const validator = require("validator");

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      skills,
      expertise,
      education,
      experience,
      location,
      portfolio,
      socialLinks
    } = req.body;

    // ===============================
    // BASIC VALIDATION
    // ===============================

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 2) {
        return res.status(400).json({
          message: "Name must be at least 2 characters"
        });
      }
    }

    if (skills !== undefined) {
      if (
        !Array.isArray(skills) ||
        skills.some((skill) => typeof skill !== "string")
      ) {
        return res.status(400).json({
          message: "Skills must be an array of strings"
        });
      }
    }

    if (expertise !== undefined) {
      if (
        !Array.isArray(expertise) ||
        expertise.some((item) => typeof item !== "string")
      ) {
        return res.status(400).json({
          message: "Expertise must be an array of strings"
        });
      }
    }

    if (education !== undefined && typeof education !== "string") {
      return res.status(400).json({
        message: "Education must be a string"
      });
    }

    if (experience !== undefined && typeof experience !== "string") {
      return res.status(400).json({
        message: "Experience must be a string"
      });
    }

    if (location !== undefined && typeof location !== "string") {
      return res.status(400).json({
        message: "Location must be a string"
      });
    }

    // ===============================
    // URL VALIDATION
    // ===============================

    if (portfolio !== undefined && portfolio !== "") {
      if (!validator.isURL(portfolio)) {
        return res.status(400).json({
          message: "Invalid portfolio URL"
        });
      }
    }

    // ===============================
    // SOCIAL LINKS VALIDATION
    // ===============================

    if (socialLinks !== undefined) {
      if (
        typeof socialLinks !== "object" ||
        Array.isArray(socialLinks)
      ) {
        return res.status(400).json({
          message: "socialLinks must be an object"
        });
      }

      if (
        socialLinks.linkedin &&
        !validator.isURL(socialLinks.linkedin)
      ) {
        return res.status(400).json({
          message: "Invalid LinkedIn URL"
        });
      }

      if (
        socialLinks.github &&
        !validator.isURL(socialLinks.github)
      ) {
        return res.status(400).json({
          message: "Invalid GitHub URL"
        });
      }

      if (
        socialLinks.twitter &&
        !validator.isURL(socialLinks.twitter)
      ) {
        return res.status(400).json({
          message: "Invalid Twitter URL"
        });
      }
    }

    // ===============================
    // FIND USER
    // ===============================

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // ===============================
    // UPDATE PROVIDED FIELDS
    // ===============================

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (skills !== undefined) {
      user.skills = skills;
    }

    if (expertise !== undefined) {
      user.expertise = expertise;
    }

    if (education !== undefined) {
      user.education = education;
    }

    if (experience !== undefined) {
      user.experience = experience;
    }

    if (location !== undefined) {
      user.location = location;
    }

    if (portfolio !== undefined) {
      user.portfolio = portfolio;
    }

    if (socialLinks !== undefined) {
      user.socialLinks = {
        linkedin: socialLinks.linkedin || "",
        github: socialLinks.github || "",
        twitter: socialLinks.twitter || ""
      };
    }

    await user.save();

    // ===============================
    // RESPONSE
    // ===============================

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
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
    console.error("PROFILE UPDATE ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// ===============================
// GET PROFILE
// ===============================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user
    });

  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to get profile"
    });
  }
};


module.exports = {
  updateProfile,
  getProfile
};
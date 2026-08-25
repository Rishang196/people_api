const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ===============================
    // BASIC USER INFORMATION
    // ===============================

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },


    // ===============================
    // PROFESSIONAL PROFILE
    // ===============================

    skills: {
      type: [String],
      default: []
    },

    expertise: {
      type: [String],
      default: []
    },

    education: {
      type: String,
      default: "",
      trim: true
    },

    experience: {
      type: String,
      default: "",
      trim: true
    },

    location: {
      type: String,
      default: "",
      trim: true
    },


    // ===============================
    // PORTFOLIO
    // ===============================

    portfolio: {
      type: String,
      default: "",
      trim: true
    },

    socialLinks: {
      linkedin: {
        type: String,
        default: "",
        trim: true
      },

      github: {
        type: String,
        default: "",
        trim: true
      },

      twitter: {
        type: String,
        default: "",
        trim: true
      }
    }
  },

  {
    timestamps: true
  }
);


// ===============================
// DATABASE INDEXES
// ===============================

// Email already has unique: true above.
// Do NOT create another email index here.

userSchema.index({ skills: 1 });
userSchema.index({ location: 1 });


// ===============================
// EXPORT MODEL
// ===============================

module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
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
      required: true
    },

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
      default: ""
    },

    experience: {
      type: String,
      default: ""
    },

    location: {
      type: String,
      default: ""
    },

    portfolio: {
      type: String,
      default: ""
    },

    socialLinks: {
      linkedin: {
        type: String,
        default: ""
      },
      github: {
        type: String,
        default: ""
      },
      twitter: {
        type: String,
        default: ""
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
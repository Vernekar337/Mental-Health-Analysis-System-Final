const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["student", "counselor", "parent", "admin"],
      required: true
    },

    age: {
      type: Number
    },
    isProfilePublic: {
      type: Boolean,
      default: false
    },

    linkedStudentIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)

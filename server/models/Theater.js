import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // ✅ prevent duplicate theaters
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    screens: {
      type: Number,
      required: true,
      min: 1,
    },

    // ✅ Add image for UI
    image: {
      type: String,
      default: "",
    },

    // ✅ Optional fields (for better UI later)
    rating: {
      type: Number,
      default: 0,
    },

    facilities: {
      type: [String],
      default: [],
    },

    contact: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true, // auto createdAt & updatedAt
  }
);

const Theater = mongoose.model("Theater", theaterSchema);

export default Theater;
import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    /* ---------------- MOVIE ---------------- */
    // 🔥 Store basic movie info (from OMDB or frontend)
    movie: {
      id: { type: String, required: true },       // imdbID
      title: { type: String, required: true },
      poster: { type: String, default: "" },
    },

    /* ---------------- THEATER ---------------- */
    // 🔥 VERY IMPORTANT (connect show with theater)
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },

    /* ---------------- SCREEN ---------------- */
    screen: {
      type: String,
      default: "Screen 1",
    },

    /* ---------------- DATE & TIME ---------------- */
    showDateTime: {
      type: Date,
      required: true,
    },

    /* ---------------- PRICE ---------------- */
    showPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    /* ---------------- SEATS ---------------- */
    // 🔥 track booked seats
    occupiedSeats: {
      type: Object,
      default: {}, 
      // example:
      // { "A1": true, "A2": true }
    },

  },
  {
    timestamps: true,
  }
);

const Show = mongoose.model("Show", showSchema);

export default Show;
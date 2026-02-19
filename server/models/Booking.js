import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: String, ref: 'User', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  bookedSeats: { type: [String], required: true },
  amount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;

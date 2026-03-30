import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: String, ref: 'User', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  bookedSeats: { type: [String], required: true },
  amount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  
  // Razorpay payment fields
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  
  // Payment status tracking
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  
  // For refunds
  refundedAt: { type: Date },
  refundAmount: { type: Number }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;

import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
router.post("/create-order", async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    const order = await razorpay.orders.create({
      amount: booking.amount * 100,
      currency: "INR",
      receipt: `booking_${bookingId}`,
    });

    booking.razorpayOrderId = order.id;
    booking.paymentStatus = "pending";
    await booking.save();

    res.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Verify Payment
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const booking = await Booking.findById(bookingId);

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: "Payment verification failed",
      });
    }

    booking.isPaid = true;
    booking.paymentStatus = "completed";
    booking.razorpayPaymentId = razorpay_payment_id;

    await booking.save();

    res.json({
      success: true,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
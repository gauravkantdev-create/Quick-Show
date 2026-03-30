import mongoose from 'mongoose';
import 'dotenv/config';
import Theater from './models/Theater.js';
import connectDB from './config/db.js';

const theaters = [
  {
    name: "PVR Cinemas",
    location: "Phoenix Mall, Mumbai",
    screens: 8,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1470&auto=format&fit=crop",
    rating: 4.5,
    facilities: ["IMAX", "Dolby Atmos", "Recliner Seats", "Food Court"],
    contact: "+91 22 1234 5678"
  },
  {
    name: "INOX Leisure",
    location: "Connaught Place, Delhi",
    screens: 6,
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1470&auto=format&fit=crop",
    rating: 4.3,
    facilities: ["4DX", "Dolby Atmos", "Premium Lounge", "Parking"],
    contact: "+91 11 9876 5432"
  },
  {
    name: "Cinepolis",
    location: "Orion Mall, Bangalore",
    screens: 10,
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1470&auto=format&fit=crop",
    rating: 4.7,
    facilities: ["IMAX", "VIP Seats", "Dolby Atmos", "Kids Zone"],
    contact: "+91 80 5555 1234"
  },
  {
    name: "Carnival Cinemas",
    location: "Ambience Mall, Gurgaon",
    screens: 5,
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1471&auto=format&fit=crop",
    rating: 4.0,
    facilities: ["3D", "Snack Bar", "Wheelchair Access"],
    contact: "+91 124 4444 5678"
  },
  {
    name: "Miraj Cinemas",
    location: "City Center, Hyderabad",
    screens: 7,
    image: "https://images.unsplash.com/photo-1596445836561-991bcd39a86d?q=80&w=1470&auto=format&fit=crop",
    rating: 4.2,
    facilities: ["Dolby Atmos", "Recliner Seats", "Food Court", "Parking"],
    contact: "+91 40 6666 7890"
  },
  {
    name: "Rajhans Cinemas",
    location: "VR Mall, Chennai",
    screens: 4,
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1470&auto=format&fit=crop",
    rating: 3.9,
    facilities: ["3D", "Snack Bar", "Premium Seats"],
    contact: "+91 44 7777 8901"
  },
  {
    name: "Star Cineplex",
    location: "South City Mall, Kolkata",
    screens: 6,
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1450&auto=format&fit=crop",
    rating: 4.1,
    facilities: ["IMAX", "Dolby 7.1", "Lounge", "Valet Parking"],
    contact: "+91 33 8888 2345"
  },
  {
    name: "Fun Cinemas",
    location: "DB Mall, Bhopal",
    screens: 3,
    image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=1479&auto=format&fit=crop",
    rating: 3.8,
    facilities: ["3D", "Snack Bar", "Kids Corner"],
    contact: "+91 755 9999 3456"
  },
  {
    name: "SRS Cinemas",
    location: "GIP Mall, Noida",
    screens: 5,
    image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1631&auto=format&fit=crop",
    rating: 4.4,
    facilities: ["4DX", "Dolby Atmos", "Premium Dine-In", "Play Area"],
    contact: "+91 120 1111 4567"
  }
];

const seedTheaters = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to DB");

    // Clear existing theaters
    await Theater.deleteMany({});
    console.log("🗑️  Cleared existing theaters");

    // Insert new theaters
    await Theater.insertMany(theaters);
    console.log(`✅ Seeded ${theaters.length} theaters successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedTheaters();

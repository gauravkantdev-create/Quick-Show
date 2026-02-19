import mongoose from 'mongoose';
import 'dotenv/config';
import Show from './models/Show.js';
import connectDB from './config/db.js';

const dummyMovies = [
  {
    id: 324544,
    title: "In the Lost Lands",
    poster_path: "https://image.tmdb.org/t/p/original/dDlfjR7gllmr8HTeN6rfrYhTdwX.jpg",
    genres: [{ id: 28, name: "Action" }, { id: 14, name: "Fantasy" }]
  },
  {
    id: 1232546,
    title: "Until Dawn",
    poster_path: "https://image.tmdb.org/t/p/original/juA4IWO52Fecx8lhAsxmDgy3M3.jpg",
    genres: [{ id: 27, name: "Horror" }, { id: 9648, name: "Mystery" }]
  }
];

const seedShows = async () => {
  try {
    await connectDB();
    await Show.deleteMany({});
    
    const shows = [];
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {
      const showDate = new Date(today);
      showDate.setDate(today.getDate() + i);
      showDate.setHours(14 + (i % 3) * 3, 30, 0, 0);
      
      shows.push({
        movie: dummyMovies[i % 2],
        showDateTime: showDate,
        showPrice: 50 + (i * 10),
        occupiedSeats: {}
      });
    }
    
    await Show.insertMany(shows);
    console.log('✅ Shows seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedShows();

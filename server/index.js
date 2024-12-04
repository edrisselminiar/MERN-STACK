import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";
import cors from "cors";

// Load environment variables first
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Environment variables
const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

// Verify environment variables
if (!MONGOURL) {
  console.error("MONGO_URL is not defined in environment variables");
  process.exit(1);
}

// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  autoIndex: true,
};

// Connection with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(MONGOURL, mongooseOptions);
    console.log("MongoDB connected successfully");
    
    // Only start server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};

// Routes
app.use("/api", route);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});

// Start the connection process
connectWithRetry();





// import express from "express";
// import mongoose from "mongoose";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import route from "./routes/userRoute.js";
// import cors from "cors";

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());
// dotenv.config();

// const PORT = process.env.PORT || 7000;
// const MONGOURL = process.env.MONGO_URL;

// mongoose
//   .connect(MONGOURL)
//   .then(() => {
//     console.log("DB connected successfully.");
//     app.listen(PORT, () => {
//       console.log(`Server is running on port :${PORT} `);
//     });
//   })
//   .catch((error) => console.log(error));

// app.use("/api", route);

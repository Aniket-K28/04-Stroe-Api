const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./connectDb/db"); // MongoDB connection file
const storeRoute = require("./routes/products");
const errorHandler = require("./middleware/errorHandler");

dotenv.config(); // Load env variables

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/products", storeRoute);

// Error Handler
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(` Server is running on http://localhost:${port}`);
});

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require("./config/db");
const wasteBinRoutes = require("./routes/wasteBinRoutes");

// Create Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/waste-bins", wasteBinRoutes);

// Connect to MongoDB
connectDB();

// Homepage
app.get("/", (req, res) => {
    res.send("Welcome to CampusWaste Management System!");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`CampusWaste server running on port ${PORT}`);
});
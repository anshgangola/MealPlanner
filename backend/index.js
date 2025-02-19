const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const recipeRoutes = require("./routes/recipeRoutes");
const mealPlanRoutes = require("./routes/recipeRoutes");

require("dotenv").config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to DB
connectDB();

// Routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/mealplan", mealPlanRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

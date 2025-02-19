const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  unit: { type: String, enum: ["g", "ml", "pieces"], required: true },
});

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  ingredients: [ingredientSchema],
  steps: [{ type: String, required: true }],
  tags: [{ type: String }],
});

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;

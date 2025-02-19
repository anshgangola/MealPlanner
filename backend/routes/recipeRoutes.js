const express = require("express");
const Recipe = require("../models/Recipe");
const router = express.Router();

// Add Recipe
// router.post("/recipes", async (req, res) => {
//   try {
//     const newRecipe = new Recipe(req.body);
//     await newRecipe.save();
//     res.status(201).json(newRecipe);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });
router.post("/recipes", async (req, res) => {
  try {
    const { name, category, ingredients, steps, tags } = req.body;

    if (!name || !category || !ingredients?.length || !steps?.length) {
      return res.status(400).json({ error: "Missing required fields." }); // 🔹 Ensure all required fields exist
    }

    const existingRecipe = await Recipe.findOne({ name: name.trim() });
    if (existingRecipe) {
      return res
        .status(400)
        .json({ error: "Recipe with similar name already exists!" }); // 🔹 Send proper error
    }

    const newRecipe = new Recipe({ name, category, ingredients, steps, tags });
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error saving recipe:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get All Recipes
router.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Recipe
router.delete("/:id", async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search a Recipe
router.get("/search", async (req, res) => {
  try {
    const { category, ingredient, tag } = req.query;
    let query = {};

    if (category) {
      query.category = { $in: [category] }; // Exact category match
    }

    if (ingredient) {
      query["ingredients.name"] = { $regex: new RegExp(ingredient, "i") }; // Case-insensitive search
    }

    if (tag) {
      query.tags = { $in: [tag] }; // Exact tag match
    }

    const recipes = await Recipe.find(query);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Generate Shopping List with Units

router.post("/shopping-list", async (req, res) => {
  try {
    //console.log("Received mealPlan:", req.body.mealPlan);

    const { mealPlan } = req.body;
    let shoppingList = [];

    if (!mealPlan || !Array.isArray(mealPlan) || mealPlan.length === 0) {
      //console.log("Meal Plan is empty or invalid:", mealPlan);
      return res.json([]);
    }

    // Extract names for correct querying
    const recipeNames = mealPlan.map((recipe) => recipe.name);
    //console.log("Querying Recipes with names:", recipeNames);

    // Retrieve full recipe objects
    const assignedRecipes = await Recipe.find({
      name: { $in: recipeNames },
    });

    //console.log("Matched Recipes:", assignedRecipes);

    // Process the ingredients
    assignedRecipes.forEach((recipe) => {
      // Flattening ingredients array from nested objects
      recipe.ingredients.forEach((ingredient) => {
        const existingItem = shoppingList.find(
          (item) =>
            item.name === ingredient.name && item.unit === ingredient.unit
        );

        if (existingItem) {
          existingItem.quantity = String(
            Number(existingItem.quantity) + Number(ingredient.quantity)
          );
        } else {
          shoppingList.push({
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          });
        }
      });
    });

    //console.log("Generated Shopping List:", shoppingList);
    res.json(shoppingList);
  } catch (error) {
    //console.error("Error generating shopping list:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

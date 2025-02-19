import React, { useState, useEffect } from "react";
import { addRecipe, getRecipes } from "../services/api";
import "../styles/AddRecipe.css";

const dietaryOptions = [
  "Vegetarian",
  "Non-Vegetarian",
  "Gluten-Free",
  "Vegan",
  "Dairy-Free",
  "Keto",
];

const unitOptions = [
  { label: "Grams (g)", value: "g" },
  { label: "Milliliters (ml)", value: "ml" },
  { label: "Pieces", value: "pieces" },
];

const AddRecipe = ({ onAdd }) => {
  const [recipe, setRecipe] = useState({
    name: "",
    category: "",
    ingredients: [],
    steps: "",
    tags: [],
    showDropdown: false,
  });

  const [existingRecipes, setExistingRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    const data = await getRecipes();
    setExistingRecipes(data);
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setExistingRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  // 🔹 Updated: Check for duplicate recipes
  const isDuplicateRecipe = () => {
    return existingRecipes.some((r) => {
      return (
        r.name.toLowerCase() === recipe.name.toLowerCase() &&
        JSON.stringify(r.ingredients.sort()) ===
          JSON.stringify(recipe.ingredients.sort())
      );
    });
  };

  // 🔹 Updated: Handle Ingredient Change
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...recipe.ingredients];

    if (field === "unit") {
      const existingIngredient = updatedIngredients.find(
        (ing, i) => i !== index && ing.name === updatedIngredients[index].name
      );

      // 🔹 Fix: Only check unit consistency for the same ingredient name
      if (existingIngredient && existingIngredient.unit !== value) {
        alert(
          "Ingredient unit type must be consistent for the same ingredient name."
        );
        return;
      }
    }

    updatedIngredients[index][field] = value;
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  // 🔹 Updated: Add New Ingredient
  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [
        ...recipe.ingredients,
        { name: "", quantity: "", unit: "g" },
      ],
    });
  };

  // 🔹 Updated: Remove Ingredient
  const removeIngredient = (index) => {
    const updatedIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const handleTagSelection = (selectedTag) => {
    setRecipe((prev) => ({
      ...prev,
      tags: prev.tags.includes(selectedTag)
        ? prev.tags.filter((tag) => tag !== selectedTag)
        : [...prev.tags, selectedTag],
      showDropdown: false,
    }));
  };

  const handleRemoveTag = (tagToRemove) => {
    setRecipe((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDuplicateRecipe()) {
      alert("Recipe with similar name already exists!!");
      return;
    }

    if (!recipe.name.trim()) {
      alert("Recipe name cannot be empty.");
      return;
    }

    if (!recipe.category.trim()) {
      alert("Please select a category.");
      return;
    }

    if (recipe.ingredients.length === 0) {
      alert("Please add at least one ingredient.");
      return;
    }

    for (let ingredient of recipe.ingredients) {
      if (!ingredient.name.trim()) {
        alert("Ingredient name cannot be empty.");
        return;
      }
      if (!ingredient.quantity) {
        alert("Please specify quantity for all ingredients.");
        return;
      }
      if (!ingredient.unit) {
        alert("Please select a unit for all ingredients.");
        return;
      }
    }

    const formattedSteps = recipe.steps
      ? recipe.steps
          .split(".")
          .map((step) => step.trim())
          .filter((step) => step) // Remove empty steps
      : [];

    if (formattedSteps.length === 0) {
      alert("Please enter at least one step for the recipe.");
      return;
    }

    const formattedRecipe = {
      name: recipe.name.trim(),
      category: recipe.category.trim(),
      ingredients: recipe.ingredients.filter((ing) => ing.name && ing.quantity), // Ensure no empty ingredients
      steps: formattedSteps,
      tags: recipe.tags,
    };

    console.log("Submitting recipe:", formattedRecipe); // 🔹 Debugging Log

    try {
      await addRecipe(formattedRecipe);
      onAdd();
    } catch (error) {
      console.error(
        "Error adding recipe:",
        error.response?.data || error.message
      ); // 🔹 Debugging Log
      if (error.response?.status === 400 && error.response?.data?.error) {
        alert(`${error.response.data.error}`); // 🔹 Show specific backend error
      } else {
        alert("Internal Server Error. Please try again.");
      }
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box">
        <form onSubmit={handleSubmit} className="form-container">
          <h1 className="form-title">Add Recipe</h1>

          {/* Recipe Name & Category */}
          <div className="row-container">
            <div className="input-box">
              <div className="input-text">
                <label>Recipe Name</label>
              </div>
              <input
                type="text"
                placeholder="Recipe Name"
                onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
              />
            </div>

            <div className="input-box">
              <div className="input-text">
                <label>Recipe Category</label>
              </div>
              <select
                onChange={(e) =>
                  setRecipe({ ...recipe, category: e.target.value })
                }
                value={recipe.category}
              >
                <option value="" disabled hidden>
                  Please Select a Category
                </option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>
          </div>

          {/* 🔹 Updated: Ingredients Section */}
          <div className="row-container">
            <div className="input-box">
              <div className="input-text">
                <label>Ingredients</label>
              </div>

              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-row">
                  <input
                    type="text"
                    placeholder="Ingredient Name"
                    value={ingredient.name}
                    onChange={(e) =>
                      handleIngredientChange(index, "name", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={ingredient.quantity}
                    onChange={(e) =>
                      handleIngredientChange(index, "quantity", e.target.value)
                    }
                  />
                  <select
                    value={ingredient.unit}
                    onChange={(e) =>
                      handleIngredientChange(index, "unit", e.target.value)
                    }
                  >
                    {unitOptions.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => removeIngredient(index)}
                  >
                    ✖
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="add-ingredient-btn"
                onClick={addIngredient}
              >
                + Add Ingredient
              </button>
            </div>
          </div>

          {/* Cooking Steps */}
          <div className="row-container">
            <div className="input-box">
              <div className="input-text">
                <label>Cooking Steps</label>
              </div>
              <textarea
                placeholder="Steps (separate by period)"
                onChange={(e) =>
                  setRecipe({ ...recipe, steps: e.target.value })
                }
              ></textarea>
            </div>
          </div>

          {/* Dietary Tags */}
          <div className="row-container">
            <div className="input-box dietary-tags-row">
              <div className="input-text">
                <label className="dietary-label">Dietary Tags</label>
              </div>
              <div className="dropdown-container">
                <button
                  type="button"
                  className="dropdown-button"
                  onClick={() =>
                    setRecipe({ ...recipe, showDropdown: !recipe.showDropdown })
                  }
                >
                  <p>Select Dietary Tags</p>
                </button>
                {recipe.showDropdown && (
                  <div className="dropdown-options">
                    {dietaryOptions.map((tag) => (
                      <div
                        key={tag}
                        className={`dropdown-item ${
                          recipe.tags.includes(tag) ? "selected" : ""
                        }`}
                        onClick={() => handleTagSelection(tag)}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Display selected dietary tags */}
          {recipe.tags.length > 0 && (
            <div className="selected-tags">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="selected-tag"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} ✖
                </span>
              ))}
            </div>
          )}

          <button type="submit" className="recipe-button">
            Add Recipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;

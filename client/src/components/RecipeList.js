import React, { useEffect, useState } from "react";
import { getRecipes, deleteRecipe, searchRecipes } from "../services/api";
import "../styles/RecipeList.css";

const dietaryOptions = [
  "Vegetarian",
  "Non-Vegetarian",
  "Gluten-Free",
  "Vegan",
  "Dairy-Free",
  "Keto",
];
const categoryOptions = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    const data = await getRecipes();
    setRecipes(data);
  };

  const handleSearch = async () => {
    const data = await searchRecipes(category, ingredient);
    if (selectedTag) {
      setRecipes(data.filter((recipe) => recipe.tags.includes(selectedTag)));
    } else {
      setRecipes(data);
    }
  };

  // 🔹 New: Reset Filters and Show All Recipes
  const handleReset = async () => {
    setCategory("");
    setIngredient("");
    setSelectedTag("");
    fetchRecipes();
  };

  const handleDelete = async (id) => {
    await deleteRecipe(id);
    fetchRecipes();
  };

  return (
    <div className="container">
      <h2>Recipe List</h2>

      {/* Search Filters */}
      <div className="search-container">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Search by Category</option>
          {categoryOptions.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by ingredient..."
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">Filter by Dietary Tag</option>
          {dietaryOptions.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <button onClick={handleSearch}>Search</button>
        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>{" "}
        {/* 🔹 New: Reset Button */}
      </div>

      {/* 🔹 Updated: Display Recipes as Tiles */}
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="recipe-tile">
            <h3>{recipe.name}</h3>
            <p>
              <strong>Category:</strong> {recipe.category}
            </p>
            <p>
              <strong>Dietary Tags:</strong>{" "}
              {recipe.tags.length > 0 ? recipe.tags.join(", ") : "None"}
            </p>
            <button
              className="delete-btn"
              onClick={() => handleDelete(recipe._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;

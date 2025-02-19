import React, { useState, useEffect } from "react";
import { getRecipes, generateShoppingList } from "../services/api";
import "../styles/MealPlanner.css";

const MealPlanner = () => {
  const [recipes, setRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState({});
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    const data = await getRecipes();
    setRecipes(data);
  };

  const assignRecipe = (day, recipeId) => {
    const selectedRecipe = recipes.find((recipe) => recipe._id === recipeId);
    if (selectedRecipe) {
      setMealPlan((prev) => ({ ...prev, [day]: selectedRecipe })); // Store full recipe object
    }
  };

  // const handleGenerateShoppingList = async () => {
  //   const list = await generateShoppingList(mealPlan);
  //   console.log("Generated Shopping List:", list);
  //   setShoppingList(list);
  // };
  // const handleGenerateShoppingList = async () => {
  //   console.log("Meal Plan being sent:", mealPlan); // Debugging
  //   const list = await generateShoppingList(mealPlan);
  //   console.log("Generated Shopping List:", list);
  //   setShoppingList(list);
  // };

  const handleGenerateShoppingList = async () => {
    const recipesArray = Object.values(mealPlan);
    console.log("Recipes Array Sent:", recipesArray);

    try {
      const response = await generateShoppingList(recipesArray);
      console.log("API Response:", response);
      setShoppingList(response);
    } catch (error) {
      console.error("Error fetching shopping list:", error);
    }
  };

  return (
    <div className="container">
      <h2>Meal Planner</h2>

      <div className="meal-days-container">
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => (
          <div key={day} className="meal-day">
            <h3>{day}</h3>
            <select onChange={(e) => assignRecipe(day, e.target.value)}>
              <option value="">Select Recipe</option>
              {recipes.map((recipe) => (
                <option key={recipe._id} value={recipe._id}>
                  {recipe.name}
                </option>
              ))}
            </select>
            {mealPlan[day] && (
              <div>
                <p>Assigned: {mealPlan[day].name}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleGenerateShoppingList}
        className="shopping-list-btn"
      >
        Generate Shopping List
      </button>

      {shoppingList.length > 0 && (
        <div className="shopping-list">
          <button
            className="shopping-list-close"
            onClick={() => setShoppingList([])}
          >
            ✖
          </button>
          <h3>Shopping List</h3>
          <ul>
            {shoppingList.map((item, index) => (
              <li key={index}>
                {item.name} - {item.quantity} {item.unit}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;

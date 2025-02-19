import axios from "axios";

const API_URL = "http://localhost:5000/api/recipes";

// Fetch all recipes
export const getRecipes = async () => {
  try {
    const response = await axios.get(`${API_URL}/recipes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};

// Add a new recipe
export const addRecipe = async (recipeData) => {
  try {
    const response = await axios.post(`${API_URL}/recipes`, recipeData);
    return response.data;
  } catch (error) {
    console.error("Error adding recipe:", error);
    throw error;
  }
};

// Delete a recipe
export const deleteRecipe = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

//Search a recipe
export const searchRecipes = async (category, ingredient, tag) => {
  let query = [];
  if (category) query.push(`category=${category}`);
  if (ingredient) query.push(`ingredient=${ingredient}`);
  if (tag) query.push(`tag=${encodeURIComponent(tag)}`);

  const response = await axios.get(
    `http://localhost:5000/api/recipes/search?${query.join("&")}`
  );
  return response.data;
};

//Generate Shopping list
export const generateShoppingList = async (mealPlan) => {
  try {
    const response = await axios.post(`${API_URL}/shopping-list`, { mealPlan });
    return response.data;
  } catch (error) {
    console.error("Error generating shopping list:", error);
    throw error;
  }
};

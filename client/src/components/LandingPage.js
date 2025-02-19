import React from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css"; // 🔹 New CSS file for landing page styling

const LandingPage = () => {
  return (
    <div className="landing-container">
      <h1>Welcome to Recipe Organizer</h1>
      <p>Manage your recipes, plan meals, and organize your shopping list.</p>

      <div className="landing-buttons">
        <Link to="/recipes" className="landing-button">
          View Recipes
        </Link>
        <Link to="/add" className="landing-button">
          Add a Recipe
        </Link>
        <Link to="/planner" className="landing-button">
          Meal Planner
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;

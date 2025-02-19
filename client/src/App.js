import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import RecipeList from "./components/RecipeList";
import AddRecipe from "./components/AddRecipe";
import MealPlanner from "./components/MealPlanner";
import LandingPage from "./components/LandingPage"; // 🔹 Import Landing Page
import "./styles/app.css";

const App = () => {
  return (
    <Router>
      <div className="container">
        <nav className="navbar">
          {" "}
          {/* 🔹 Fixed className typo */}
          <div className="navbar-left">
            <span className="navbar-title">Recipe Organizer</span>
          </div>
          <div className="navbar-right">
            <Link to="/" className="navbar-link">
              Home
            </Link>{" "}
            {/* 🔹 Updated: Home leads to Landing Page */}
            <Link to="/recipes" className="navbar-link">
              Recipes
            </Link>
            <Link to="/add" className="navbar-link">
              Add Recipe
            </Link>
            <Link to="/planner" className="navbar-link">
              Meal Planner
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<LandingPage />} />{" "}
          {/* 🔹 Landing Page as Default */}
          <Route path="/recipes" element={<RecipeList />} />
          <Route
            path="/add"
            element={<AddRecipe onAdd={() => window.location.reload()} />}
          />
          <Route path="/planner" element={<MealPlanner />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

import React, { useState, ChangeEvent } from "react";
import image_hero from "../../public/images/spoonfed.jpg";
import "./aiHero.css";

/**
 * Interface for form data
 */
interface FormData {
  ingredients: string;
  mealType: string;
  cuisine: string;
  cookingTime: string;
  complexity: string;
  people: string;
  note: string;
}

/**
 * Props for RecipeCard component
 */
interface RecipeCardProps {
  onSubmit: (formData: FormData) => void;
}

/**
 * RecipeCard component for generating recipes
 */
const RecipeCard: React.FC<RecipeCardProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    ingredients: "",
    mealType: "",
    cuisine: "",
    cookingTime: "",
    complexity: "",
    people: "",
    note: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (): void => {
    if (
      !formData.ingredients ||
      !formData.mealType ||
      !formData.cuisine ||
      !formData.cookingTime ||
      !formData.complexity ||
      !formData.people
    ) {
      alert("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="recipe-card">
      <h2 className="recipe-card-title">Recipe Generator</h2>
      <div className="recipe-card-form">
        <div className="form-field">
          <label htmlFor="ingredients">Ingredients</label>
          <input
            id="ingredients"
            type="text"
            placeholder="e.g., chicken, rice"
            value={formData.ingredients}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        
        <div className="form-field">
          <label htmlFor="mealType">Meal Type</label>
          <select
            id="mealType"
            value={formData.mealType}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select meal type</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
        </div>
        
        <div className="form-field">
          <label htmlFor="cuisine">Cuisine</label>
          <input
            id="cuisine"
            type="text"
            placeholder="e.g., Italian, Mexican"
            value={formData.cuisine}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        
        <div className="form-field">
          <label htmlFor="cookingTime">Cooking Time</label>
          <select
            id="cookingTime"
            value={formData.cookingTime}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select cooking time</option>
            <option value="< 30 mins">{"< 30 mins"}</option>
            <option value="30-60 mins">30-60 mins</option>
            <option value="> 1 hour">{"> 1 hour"}</option>
          </select>
        </div>
        
        <div className="form-field">
          <label htmlFor="complexity">Complexity</label>
          <select
            id="complexity"
            value={formData.complexity}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select complexity</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        
        <div className="form-field">
          <label htmlFor="people">Number of People</label>
          <input
            id="people"
            type="number"
            placeholder="e.g., 4"
            value={formData.people}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        
        <div className="form-field">
          <label htmlFor="note">Note (Optional)</label>
          <input
            id="note"
            type="text"
            placeholder="Any specific requirements (e.g., lactose-free)"
            value={formData.note}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>
      <div className="form-actions">
        <button
          onClick={handleSubmit}
          className="generate-recipe-btn"
        >
          Generate Recipe
        </button>
      </div>
    </div>
  );
};

/**
 * Props for Hero component
 */
interface HeroProps {
  onRecipeSubmit: (formData: FormData) => void;
}

/**
 * Hero component with recipe generator
 */
const Hero: React.FC<HeroProps> = ({ onRecipeSubmit }) => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text-container">
            <div className="hero-badge">
              <div className="hero-badge-dot"></div>
              <p className="hero-badge-text">Try Creative</p>
            </div>
            <p className="hero-subtitle">A New Cooking Experience</p>
            <h1 className="hero-title">with AI</h1>
            <p className="hero-description">
              Tired of cooking the same thing every day? Let AI inspire you with new, 
              exciting recipes using what you already have. Discover easy, delicious meals from around the world 
              and bring variety back to your table – all while learning about the nutrition in every dish.
            </p>
            <div className="hero-divider"></div>
            <div className="hero-image-container">
              <img 
                src={image_hero} 
                alt="Food preparation" 
                className="hero-image"
              />
            </div>
          </div>
          <RecipeCard onSubmit={onRecipeSubmit} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
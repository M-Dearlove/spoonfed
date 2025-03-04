import React from "react";
import { Link } from "react-router-dom";
import '../styles/Mainpage.css'

const MainPage: React.FC = () => {
  const token = localStorage.getItem('id_token'); // or any other logic to get the token
  return (
    <div className="main-page">
      <div className="hero-container">
        {/* Logo */}
        <img
          src="/images/spoonfed.jpg"
          alt="Spoon Fed Logo"
          className="logo"
        />

        {/* Main Title */}
        <h1 className="main-title">Spoon Fed</h1>

        {/* Subtitle */}
        <p className="subtitle">
          Your culinary companion for discovering, saving, and sharing delicious recipes tailored to your ingredients
        </p>

        {/* Features */}
        <div className="features">
          <Link to="ingredient-page" className="feature-card">
            <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z" clip-rule="evenodd" />
            </svg>
            <h3 className="feature-title">Ingredient Search</h3>
            <p className="feature-description">Find recipes based on ingredients you have</p>
          </Link>
          {token ? (
            <><Link to="/profile" className="feature-card">
              <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <h3 className="feature-title">Save & Organize</h3>
              <p className="feature-description">Collect and manage your favorite recipes</p>
            </Link><Link to="/saved-recipes" className="feature-card">
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                  <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
                </svg>
                <h3 className="feature-title">Smart Matching</h3>
                <p className="feature-description">Utilize AI to find new recipes</p>
              </Link></>
          ) : (
            <Link to="/aiRecipe" className="feature-card">
              <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
              </svg>
              <h3 className="feature-title">Smart Matching</h3>
              <p className="feature-description">Utilize AI to find new recipes</p>
            </Link>
          )
          }
        </div>
      </div>


      {/* Footer */}
      <footer className="main-footer">
        <p>© {new Date().getFullYear()} Spoon Fed. Cooking made easy.</p>
      </footer>
    </div>

  );
};

export default MainPage;
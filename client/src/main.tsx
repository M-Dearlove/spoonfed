// main.tsx
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

// Fix import paths
import App from "../app.tsx";
import ErrorPage from "./pages/ErrorPage";
import MainPage from "./pages/Mainpage";
import RecipeSearch from "./components/RecipeSearch";
import SavedRecipes from "./pages/SavedRecipes";
import PairingDisplay from "./components/PairingDisplay.tsx";
import RecipeDetail from "./services/RecipeDetailService.ts";
import UserProfile from "./pages/UserProfile";
import Dashboard from "./pages/dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register.tsx";
import IngredientsPage from "./pages/Ingredientspage.tsx";
import AiRecipePage from "./pages/aiRecipes.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "recipe-search",
        element: <RecipeSearch />,
      },
      {
        path: "profile",
        element: <UserProfile />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "saved-recipes",
        element: <SavedRecipes />,
      },
      {
        path: "ingredient-page",
        element: <IngredientsPage />,
      },
      {
        path: "recipe/:id",
        element: <RecipeDetail recipeId={""} spoonacularApiKey={""} />,
      },
      {
        path: "aiRecipe",
        element: <AiRecipePage />
      },
      {
        path: "pairing/:recipeId",
        element: (
          <PairingDisplay
            recipe={{
              sourceUrl: "",
              suggestedPairings: [],
              customPairings: [],
              id: "",
              title: "",
              description: "",
              foodGroup: "",
              ingredients: [],
              instructions: [],
              searchMode: false,
              matchingIngredients: "",
            }}
          />
        ),
      },
    ],
  },
]);

// Create root and render
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default router;
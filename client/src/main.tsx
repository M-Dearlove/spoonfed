import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';

// Import components
import App from './components/app';
import ErrorPage from './pages/ErrorPage';
import MainPage from './pages/Mainpage';
import RecipeList from './components/RecipeList';
import SavedRecipes from './pages/SavedRecipes';
import Dashboard from './pages/dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MainPage />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/saved-recipes',
        element: <SavedRecipes />
      },
      {
        path: '/recipes',
        element: <RecipeList recipes={[]} />  // Handle empty state within component
      },
     
    ]
  }
]);

// Create root and render
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
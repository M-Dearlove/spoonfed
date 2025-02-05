import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from '../pages/dashboard'; 
const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Spoonfed
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Dashboard />
        </main>
      </div>
    </Router>
  );
};

export default App;
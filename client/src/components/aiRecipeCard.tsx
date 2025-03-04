import React from "react";
import { jsPDF } from "jspdf";
import "../styles/aiRecipeCard.css";

interface RecipeDisplayProps {
  error?: string | null;
  recipeText?: string;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ error, recipeText }) => {
  const formatText = (text: string): string => {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  };

  const generatePDF = (): void => {
    const doc = new jsPDF();
    const recipeContent = recipeText?.replace(/\*\*(.*?)\*\*/g, "$1") || "";
    
    // Set up PDF content
    doc.setFontSize(16);
    doc.text("Generated Recipe", 10, 10);
    
    // Split the content into lines and add to PDF
    const lines = doc.splitTextToSize(recipeContent, 180);
    doc.setFontSize(12);
    doc.text(lines, 10, 20);
    
    // Save the PDF
    doc.save("Recipe.pdf");
  };

  return (
    <div className="recipe-display">
      {error && <p className="recipe-error">{error}</p>}
      {recipeText ? (
        <div className="recipe-content">
          <h2 className="recipe-title">Generated Recipe</h2>
          <p
            className="recipe-text"
            dangerouslySetInnerHTML={{ __html: formatText(recipeText) }}
          />
          <button
            onClick={generatePDF}
            className="download-pdf-btn"
          >
            Download as PDF
          </button>
        </div>
      ) : (
        <p className="recipe-placeholder">No recipe available. Please submit your request above.</p>
      )}
    </div>
  );
};

export default RecipeDisplay;
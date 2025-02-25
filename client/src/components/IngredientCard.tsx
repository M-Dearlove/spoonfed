import React, { useState } from 'react';

interface IngredientCardProps {
  ingredient: string;
  isSelected: boolean;
  onNavigate: () => void;
  onSelect: () => void;
}

const getIngredientImageUrl = (ingredient: string): string => {
  const formattedName = ingredient.toLowerCase().replace(/\s+/g, '-');
  return `https://spoonacular.com/cdn/ingredients_250x250/${formattedName}.jpg`;
};

export const IngredientCard: React.FC<IngredientCardProps> = ({
  ingredient,
  isSelected,
  onNavigate,
  onSelect,
}) => {
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      onNavigate();
    }, 500); // 500ms long press to navigate
    setLongPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    onSelect();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate();
  };

  return (
    <div 
      className={`ingredient-card ${isSelected ? 'selected' : ''}`}
      onContextMenu={handleContextMenu}
    >
      <div 
        className="ingredient-image-container"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={imageError ? '/images/ingredient-placeholder.jpg' : getIngredientImageUrl(ingredient)}
          alt={ingredient}
          className="ingredient-image"
          onError={handleImageError}
        />
      </div>
      <div className="ingredient-name">
        {ingredient}
      </div>
      <button
        className="ingredient-select-btn"
        onClick={handleClick}
      >
        {isSelected ? '✓' : '+'}
      </button>
    </div>
  );
};
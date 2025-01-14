import React from 'react';

interface Theme {
  id: string;
  name: string;
  background_gradient_start: string;
  background_gradient_end: string;
  card_background: string;
  button_color: string;
  text_color: string;
}

interface ThemePreviewProps {
  theme: Theme;
  isSelected: boolean;
  onSelect: (themeId: string) => void;
}

export const ThemePreview = ({ theme, isSelected, onSelect }: ThemePreviewProps) => {
  const isMarbleTheme = theme.name.includes('Marble');
  
  return (
    <div
      className={`relative p-6 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary' : 'hover:shadow-lg'
      }`}
      style={{
        background: `linear-gradient(135deg, ${theme.background_gradient_start}, ${theme.background_gradient_end})`,
        color: theme.text_color,
      }}
      onClick={() => onSelect(theme.id)}
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{theme.name}</h3>
        
        {/* Preview Card */}
        <div
          className="p-4 rounded-lg shadow-sm"
          style={{ 
            backgroundColor: theme.card_background,
            backdropFilter: isMarbleTheme ? 'blur(8px)' : 'none',
            border: isMarbleTheme ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
          }}
        >
          <p className="text-sm" style={{ color: theme.text_color }}>
            Preview Card
          </p>
        </div>

        {/* Sample Button */}
        <button
          className="px-4 py-2 rounded text-sm transition-colors duration-200"
          style={{
            backgroundColor: theme.button_color,
            color: '#FFFFFF',
          }}
        >
          Sample Button
        </button>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="bg-primary text-white text-xs px-2 py-1 rounded">
            Selected
          </div>
        </div>
      )}
    </div>
  );
};
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
  return (
    <div
      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary' : 'hover:shadow-lg'
      }`}
      style={{
        background: `linear-gradient(135deg, ${theme.background_gradient_start}, ${theme.background_gradient_end})`,
        color: theme.text_color,
      }}
      onClick={() => onSelect(theme.id)}
    >
      <h3 className="text-lg font-semibold mb-2">{theme.name}</h3>
      <div
        className="p-2 rounded"
        style={{ backgroundColor: theme.card_background }}
      >
        <p className="text-sm">Preview Card</p>
      </div>
      <button
        className="mt-2 px-4 py-1 rounded text-sm"
        style={{
          backgroundColor: theme.button_color,
          color: '#FFFFFF',
        }}
      >
        Sample Button
      </button>
    </div>
  );
};
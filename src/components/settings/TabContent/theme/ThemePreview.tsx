import React from 'react';

interface Theme {
  id: string;
  name: string;
  background_gradient_start: string;
  background_gradient_end: string;
  card_background: string;
  button_color: string;
  text_color: string;
  texture_url?: string;
}

interface ThemePreviewProps {
  theme: Theme;
  isSelected: boolean;
  onSelect: (themeId: string) => void;
}

export const ThemePreview = ({ theme, isSelected, onSelect }: ThemePreviewProps) => {
  const isMarbleTheme = theme.name.toLowerCase().includes('marble');
  
  const backgroundStyle = isMarbleTheme && theme.texture_url
    ? {
        backgroundImage: `url(${theme.texture_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {
        background: `linear-gradient(135deg, ${theme.background_gradient_start}, ${theme.background_gradient_end})`,
      };

  return (
    <div
      className={`relative p-6 rounded-lg cursor-pointer transition-all duration-200 overflow-hidden min-h-[240px] ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-lg'
      }`}
      style={backgroundStyle}
      onClick={() => onSelect(theme.id)}
    >
      {isMarbleTheme && (
        <div 
          className="absolute inset-0" 
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(0px)',
          }}
        />
      )}

      <div className="relative space-y-4 z-10">
        <h3 className="text-lg font-semibold" style={{ color: theme.text_color }}>
          {theme.name}
        </h3>
        
        <div
          className="p-4 rounded-lg shadow-sm"
          style={{ 
            backgroundColor: isMarbleTheme ? 'rgba(255, 255, 255, 0.7)' : theme.card_background,
            backdropFilter: isMarbleTheme ? 'blur(4px)' : 'none',
            border: isMarbleTheme ? '1px solid rgba(255, 255, 255, 0.4)' : 'none'
          }}
        >
          <p className="text-sm" style={{ color: theme.text_color }}>
            Preview Card
          </p>
        </div>

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
        <div className="absolute top-2 right-2 z-20">
          <div className="bg-primary text-white text-xs px-2 py-1 rounded">
            Selected
          </div>
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { ThemePreview } from './ThemePreview';

interface Theme {
  id: string;
  name: string;
  background_gradient_start: string;
  background_gradient_end: string;
  card_background: string;
  button_color: string;
  text_color: string;
}

interface ThemeListProps {
  themes: Theme[];
  selectedTheme: string | null;
  onThemeSelect: (themeId: string) => void;
}

export const ThemeList = ({ themes, selectedTheme, onThemeSelect }: ThemeListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {themes.map((theme) => (
        <ThemePreview
          key={theme.id}
          theme={theme}
          isSelected={selectedTheme === theme.id}
          onSelect={onThemeSelect}
        />
      ))}
    </div>
  );
};
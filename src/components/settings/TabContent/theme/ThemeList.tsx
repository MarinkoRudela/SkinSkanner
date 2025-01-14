import React from 'react';
import { ThemePreview } from './ThemePreview';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  // Separate marble themes from other themes
  const marbleThemes = themes.filter(theme => theme.name.includes('Marble'));
  const otherThemes = themes.filter(theme => !theme.name.includes('Marble'));

  return (
    <div className="space-y-8">
      {marbleThemes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Marble Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marbleThemes.map((theme) => (
                <ThemePreview
                  key={theme.id}
                  theme={theme}
                  isSelected={selectedTheme === theme.id}
                  onSelect={onThemeSelect}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {otherThemes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Standard Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherThemes.map((theme) => (
                <ThemePreview
                  key={theme.id}
                  theme={theme}
                  isSelected={selectedTheme === theme.id}
                  onSelect={onThemeSelect}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
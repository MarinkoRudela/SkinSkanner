import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ThemeList } from "./theme/ThemeList";

interface Theme {
  id: string;
  name: string;
  background_gradient_start: string;
  background_gradient_end: string;
  card_background: string;
  button_color: string;
  text_color: string;
  is_default: boolean;
}

interface ThemeTabProps {
  session: any;
}

export const ThemeTab = ({ session }: ThemeTabProps) => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchThemes();
    fetchUserTheme();
  }, []);

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*');

      if (error) throw error;
      setThemes(data || []);
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast({
        title: "Error",
        description: "Failed to load themes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserTheme = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('theme_id')
        .eq('id', session?.user?.id)
        .single();

      if (error) throw error;
      setSelectedTheme(data?.theme_id || null);
    } catch (error) {
      console.error('Error fetching user theme:', error);
    }
  };

  const handleThemeSelect = async (themeId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ theme_id: themeId })
        .eq('id', session?.user?.id);

      if (error) throw error;

      setSelectedTheme(themeId);
      toast({
        title: "Success",
        description: "Theme updated successfully",
      });
    } catch (error) {
      console.error('Error updating theme:', error);
      toast({
        title: "Error",
        description: "Failed to update theme. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Customization</CardTitle>
      </CardHeader>
      <CardContent>
        <ThemeList
          themes={themes}
          selectedTheme={selectedTheme}
          onThemeSelect={handleThemeSelect}
        />
      </CardContent>
    </Card>
  );
};
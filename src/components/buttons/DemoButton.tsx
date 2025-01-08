import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/signup')}
      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-6 sm:py-4 text-base sm:text-sm rounded-xl"
    >
      <CalendarDays className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
      Sign Up Now
    </Button>
  );
};
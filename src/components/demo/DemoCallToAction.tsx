import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoCallToAction = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="mt-8 p-8 text-center bg-primary/5">
      <h3 className="text-xl font-semibold mb-4">
        Transform Your Med Spa Business
      </h3>
      <p className="text-muted-foreground mb-6">
        Join leading med spas using our AI-powered skin analysis to enhance consultations and boost bookings.
      </p>
      <Button 
        onClick={() => navigate('/signup')}
        className="bg-primary hover:bg-primary-hover text-white px-8 py-6"
      >
        Sign Up Now <ArrowRight className="ml-2" />
      </Button>
    </Card>
  );
};
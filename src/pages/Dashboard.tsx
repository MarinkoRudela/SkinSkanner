import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { ConfigurationView } from "@/components/ConfigurationView";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [bookingUrl, setBookingUrl] = useState("");

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
        return;
      }
      setSession(session);
      fetchBookingUrl(session.user.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchBookingUrl = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('business_settings')
        .select('booking_url')
        .eq('profile_id', userId)
        .single();

      if (error) throw error;
      if (data) setBookingUrl(data.booking_url);
    } catch (error: any) {
      console.error('Error fetching booking URL:', error);
    }
  };

  const updateBookingUrl = async (url: string) => {
    try {
      const { error } = await supabase
        .from('business_settings')
        .upsert({
          profile_id: session?.user?.id,
          booking_url: url,
        });

      if (error) throw error;
      
      // Update local state after successful database update
      setBookingUrl(url);
    } catch (error: any) {
      console.error('Error updating booking URL:', error);
      throw error;
    }
  };

  if (!session) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="mt-8">
          <h1 className="text-3xl font-bold mb-6">Business Dashboard</h1>
          <ConfigurationView 
            session={session}
            bookingUrl={bookingUrl}
            updateBookingUrl={updateBookingUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
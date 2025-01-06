import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { ConfigurationView } from "@/components/ConfigurationView";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState<any>(null);
  const [bookingUrl, setBookingUrl] = useState("");

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const paymentStatus = searchParams.get('payment');
      const email = searchParams.get('email');
      
      if (paymentStatus === 'success' && email) {
        try {
          // Send verification email after successful payment
          const { error } = await supabase.functions.invoke('handle-successful-payment', {
            body: { email }
          });

          if (error) throw error;

          toast({
            title: "Success",
            description: "Payment successful! Please check your email (including spam folder) to verify your account.",
          });

          // Clean up URL parameters
          navigate('/dashboard', { replace: true });
        } catch (error: any) {
          console.error('Error handling payment success:', error);
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    };

    handlePaymentSuccess();
  }, [searchParams, navigate]);

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
    if (!session?.user?.id) return;
    
    try {
      // First check if a record exists
      const { data: existingSettings } = await supabase
        .from('business_settings')
        .select('id')
        .eq('profile_id', session.user.id)
        .single();

      let error;
      
      if (existingSettings) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('business_settings')
          .update({ booking_url: url })
          .eq('profile_id', session.user.id);
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('business_settings')
          .insert([{ 
            profile_id: session.user.id, 
            booking_url: url 
          }]);
        error = insertError;
      }

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
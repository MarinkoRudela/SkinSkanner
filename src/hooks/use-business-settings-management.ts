import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';
import { globalRequestQueue } from '@/utils/requestQueue';

export const useBusinessSettingsManagement = () => {
  const [bookingUrl, setBookingUrl] = useState<string>('');

  const fetchBusinessSettings = async (userId: string) => {
    return globalRequestQueue.add(async () => {
      try {
        console.log('Fetching business settings...');
        const { data, error } = await supabase
          .from('business_settings')
          .select('booking_url')
          .eq('profile_id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching business settings:', error);
          toast({
            title: "Error",
            description: "Failed to load business settings",
            variant: "destructive"
          });
          return;
        }

        console.log('Business settings data:', data);
        if (data) {
          setBookingUrl(data.booking_url);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  };

  const updateBookingUrl = async (url: string, session: any) => {
    if (!session) return;

    return globalRequestQueue.add(async () => {
      try {
        console.log('Updating booking URL...');
        
        // First check if a record exists
        const { data: existingSettings, error: checkError } = await supabase
          .from('business_settings')
          .select('id')
          .eq('profile_id', session.user.id)
          .maybeSingle();

        if (checkError) {
          throw checkError;
        }

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

        setBookingUrl(url);
        toast({
          title: "Success",
          description: "Booking URL updated successfully"
        });
      } catch (error: any) {
        console.error('Error updating booking URL:', error);
        toast({
          title: "Error",
          description: "Failed to update booking URL",
          variant: "destructive"
        });
        throw error;
      }
    });
  };

  return {
    bookingUrl,
    fetchBusinessSettings,
    updateBookingUrl
  };
};
import React from 'react';
import { ConfigurationView } from '@/components/ConfigurationView';

interface ConfigSectionProps {
  session: any;
  bookingUrl: string;
  updateBookingUrl: (url: string) => Promise<void>;
}

export const ConfigSection = ({ session, bookingUrl, updateBookingUrl }: ConfigSectionProps) => {
  return (
    <ConfigurationView 
      session={session}
      bookingUrl={bookingUrl}
      updateBookingUrl={updateBookingUrl}
    />
  );
};
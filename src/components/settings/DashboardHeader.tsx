import { Navigation } from "../Navigation";

interface DashboardHeaderProps {
  session: any;
}

export const DashboardHeader = ({ session }: DashboardHeaderProps) => {
  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        <Navigation session={session} />
      </div>
      <h2 className="text-2xl font-semibold mb-6">Business Dashboard</h2>
    </>
  );
};
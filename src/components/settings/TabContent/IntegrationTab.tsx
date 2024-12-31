import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IntegrationGuide } from "../IntegrationGuide";
import { ShareLinks } from "../ShareLinks";

interface IntegrationTabProps {
  userId: string;
}

export const IntegrationTab = ({ userId }: IntegrationTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <IntegrationGuide />
        <ShareLinks userId={userId} />
      </CardContent>
    </Card>
  );
};
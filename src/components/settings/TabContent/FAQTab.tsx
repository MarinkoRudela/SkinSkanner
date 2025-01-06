import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">
          Find answers to common questions about using our skin analysis tool.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is the Skin Scanner tool?</AccordionTrigger>
          <AccordionContent>
            The Skin Scanner is an AI-powered facial analysis tool that helps medical spas and aestheticians provide personalized treatment recommendations to their clients. It analyzes facial features from multiple angles and generates tailored skincare suggestions.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>How accurate are the treatment recommendations?</AccordionTrigger>
          <AccordionContent>
            Our AI-powered analysis provides evidence-based recommendations using advanced image processing technology. However, these suggestions are meant to be guidelines and should be used in conjunction with professional medical advice during in-person consultations.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>How do I integrate the scanner with my website?</AccordionTrigger>
          <AccordionContent>
            Once you've set up your account and customized your branding, you'll receive a unique link that you can share with clients or embed on your website. The integration process is straightforward and requires no technical knowledge.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Is client data stored securely?</AccordionTrigger>
          <AccordionContent>
            We prioritize privacy and security. Client photos are processed in real-time and are not stored on our servers. The analysis is performed instantly, and no personal information is retained after the session ends.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>Can I customize the booking link?</AccordionTrigger>
          <AccordionContent>
            Yes, you can customize your booking link in the Booking Settings tab. This allows you to direct clients to your preferred scheduling platform after they receive their skin analysis results.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
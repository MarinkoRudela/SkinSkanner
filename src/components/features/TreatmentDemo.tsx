import React from 'react';
import { Check, ChevronDown, Syringe, Face, Sparkles } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const treatments = [
  {
    category: "Facial Treatments",
    icon: <Face className="w-5 h-5" />,
    treatments: [
      { name: "Chemical Peels", description: "Exfoliating treatments that improve skin texture" },
      { name: "Microdermabrasion", description: "Physical exfoliation for renewed skin" },
      { name: "LED Light Therapy", description: "Light-based treatment for various skin concerns" }
    ]
  },
  {
    category: "Injectable Treatments",
    icon: <Syringe className="w-5 h-5" />,
    requiresLicense: true,
    treatments: [
      { name: "Botox/Neurotoxins", description: "Reduces appearance of fine lines", requiresLicense: true },
      { name: "Dermal Fillers", description: "Restores volume and enhances features", requiresLicense: true }
    ]
  },
  {
    category: "Body Treatments",
    icon: <Sparkles className="w-5 h-5" />,
    treatments: [
      { name: "Body Contouring", description: "Non-invasive fat reduction and toning" },
      { name: "Cellulite Reduction", description: "Improves appearance of cellulite" }
    ]
  }
];

const TreatmentDemo = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 rounded-xl bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-indigo-900 mb-2">
          Customize Your Treatment Menu
        </h3>
        <p className="text-gray-600">
          Select the treatments you offer to ensure AI recommendations match your services
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {treatments.map((category, idx) => (
          <AccordionItem
            key={idx}
            value={`item-${idx}`}
            className="border rounded-lg px-4 hover:bg-secondary/50 transition-colors"
          >
            <AccordionTrigger className="flex items-center py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  {category.icon}
                </div>
                <span className="text-lg font-medium">
                  {category.category}
                </span>
                {category.requiresLicense && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    License Required
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-4 pl-12">
                {category.treatments.map((treatment, treatmentIdx) => (
                  <div
                    key={treatmentIdx}
                    className="flex items-start space-x-3 group hover:bg-secondary/30 p-3 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 rounded border border-primary/30 group-hover:border-primary/50 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary/50" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">
                          {treatment.name}
                        </h4>
                        {treatment.requiresLicense && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                            License Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {treatment.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Pro tip:</span> Customize this list to match your med spa's offerings
          </div>
          <div className="text-sm text-primary">
            12 Treatments Available
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentDemo;
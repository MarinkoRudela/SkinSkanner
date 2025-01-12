import { LucideIcon } from 'lucide-react';
import { Syringe, UserCircle, Sparkles, Zap, Droplet } from 'lucide-react';

type TreatmentCategory = {
  category: string;
  icon: LucideIcon;
  requiresLicense?: boolean;
  treatments: {
    name: string;
    description: string;
    requiresLicense?: boolean;
  }[];
};

export const treatmentCategories: TreatmentCategory[] = [
  {
    category: "Facial Treatments",
    icon: UserCircle,
    treatments: [
      {
        name: "Chemical Peels",
        description: "Professional exfoliating treatments for skin renewal"
      },
      {
        name: "Microdermabrasion",
        description: "Physical exfoliation for improved skin texture"
      },
      {
        name: "LED Light Therapy",
        description: "Light-based treatment for various skin concerns"
      },
      {
        name: "Facial Treatments",
        description: "Customized facials for specific skin concerns"
      }
    ]
  },
  {
    category: "Injectable Treatments",
    icon: Syringe,
    requiresLicense: true,
    treatments: [
      {
        name: "Neurotoxins",
        description: "Reduces appearance of fine lines and wrinkles",
        requiresLicense: true
      },
      {
        name: "Dermal Fillers",
        description: "Restores volume and enhances facial features",
        requiresLicense: true
      },
      {
        name: "Collagen Stimulators",
        description: "Promotes natural collagen production",
        requiresLicense: true
      }
    ]
  },
  {
    category: "Energy-Based Treatments",
    icon: Zap,
    treatments: [
      {
        name: "Laser Treatments",
        description: "Various laser therapies for skin concerns"
      },
      {
        name: "Radiofrequency Treatments",
        description: "Heat-based skin tightening and rejuvenation"
      }
    ]
  },
  {
    category: "Hydration Treatments",
    icon: Droplet,
    treatments: [
      {
        name: "HydraFacial",
        description: "Multi-step facial treatment for deep hydration"
      },
      {
        name: "Moisture Infusion",
        description: "Deep hydration treatments"
      }
    ]
  }
];
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
    subtypes?: string[];
  }[];
};

export const treatmentCategories: TreatmentCategory[] = [
  {
    category: "Facial Treatments",
    icon: UserCircle,
    treatments: [
      {
        name: "Chemical Peels",
        description: "Professional exfoliating treatments for skin renewal",
        subtypes: [
          "Glycolic Acid Peel",
          "Salicylic Acid Peel",
          "TCA Peel",
          "Jessner Peel"
        ]
      },
      {
        name: "Microdermabrasion",
        description: "Physical exfoliation for improved skin texture",
        subtypes: [
          "Diamond Tip",
          "Crystal",
          "Hydradermabrasion"
        ]
      },
      {
        name: "LED Light Therapy",
        description: "Light-based treatment for various skin concerns",
        subtypes: [
          "Blue Light (Acne)",
          "Red Light (Anti-aging)",
          "Near-Infrared (Healing)"
        ]
      },
      {
        name: "Facial Treatments",
        description: "Customized facials for specific skin concerns",
        subtypes: [
          "Hydrating Facial",
          "Anti-aging Facial",
          "Acne Facial",
          "Oxygen Facial"
        ]
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
        requiresLicense: true,
        subtypes: [
          "Botox",
          "Dysport",
          "Xeomin",
          "Jeuveau"
        ]
      },
      {
        name: "Dermal Fillers",
        description: "Restores volume and enhances facial features",
        requiresLicense: true,
        subtypes: [
          "Hyaluronic Acid Fillers",
          "Calcium Hydroxylapatite",
          "Poly-L-lactic Acid",
          "Polymethyl-methacrylate"
        ]
      },
      {
        name: "Collagen Stimulators",
        description: "Promotes natural collagen production",
        requiresLicense: true,
        subtypes: [
          "Sculptra",
          "Radiesse",
          "PCL Collagen Stimulator"
        ]
      }
    ]
  },
  {
    category: "Body Treatments",
    icon: Sparkles,
    treatments: [
      {
        name: "Body Contouring",
        description: "Non-invasive fat reduction and body sculpting",
        subtypes: [
          "CoolSculpting",
          "Ultrasound Therapy",
          "Radio Frequency",
          "Electromagnetic Muscle Stimulation"
        ]
      },
      {
        name: "Cellulite Reduction",
        description: "Improves appearance of cellulite",
        subtypes: [
          "Acoustic Wave Therapy",
          "Vacuum Therapy",
          "Injectable Treatments"
        ]
      },
      {
        name: "Skin Tightening",
        description: "Firms and tightens loose skin",
        subtypes: [
          "RF Skin Tightening",
          "Ultrasound Therapy",
          "Infrared Light Treatment"
        ]
      }
    ]
  },
  {
    category: "Energy-Based Treatments",
    icon: Zap,
    treatments: [
      {
        name: "Laser Treatments",
        description: "Various laser therapies for skin concerns",
        subtypes: [
          "IPL Photofacial",
          "Fractional Laser",
          "CO2 Laser",
          "Nd:YAG Laser"
        ]
      },
      {
        name: "Radiofrequency Treatments",
        description: "Heat-based skin tightening and rejuvenation",
        subtypes: [
          "Monopolar RF",
          "Bipolar RF",
          "Fractional RF"
        ]
      }
    ]
  },
  {
    category: "Hydration Treatments",
    icon: Droplet,
    treatments: [
      {
        name: "HydraFacial",
        description: "Multi-step facial treatment for deep hydration",
        subtypes: [
          "Signature HydraFacial",
          "Deluxe HydraFacial",
          "Platinum HydraFacial"
        ]
      },
      {
        name: "Moisture Infusion",
        description: "Deep hydration treatments",
        subtypes: [
          "Hyaluronic Acid Treatment",
          "Oxygen Infusion",
          "Aquagold"
        ]
      }
    ]
  }
];
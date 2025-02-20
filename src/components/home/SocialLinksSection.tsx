
import { Youtube, Instagram } from "lucide-react";

export const SocialLinksSection = () => {
  return (
    <div className="py-12 bg-white/10">
      <div className="max-w-4xl mx-auto text-center px-4 space-y-6">
        <p className="text-lg text-gray-700">
          Want to learn more about skin analysis and how Skin Skanner works?
          <br />
          Follow us on social media for free knowledge and tips!
        </p>
        <div className="flex items-center justify-center gap-6">
          <a
            href="https://www.youtube.com/@SkinSkannerAI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
          >
            <Youtube className="h-8 w-8" />
            <span className="text-sm">YouTube</span>
          </a>
          <a
            href="https://instagram.com/skinskannerai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
          >
            <Instagram className="h-8 w-8" />
            <span className="text-sm">Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
};

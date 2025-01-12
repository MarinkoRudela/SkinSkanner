import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

interface SignUpFormProps {
  loading: boolean;
  formData: {
    email: string;
    password: string;
    businessName: string;
  };
  setFormData: (data: {
    email: string;
    password: string;
    businessName: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLoginClick: () => void;
}

export const SignUpForm = ({
  loading,
  formData,
  setFormData,
  onSubmit,
  onLoginClick,
}: SignUpFormProps) => {
  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
            Business Name
          </label>
          <Input
            id="businessName"
            type="text"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={6}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : "Sign Up & Continue to Payment"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <Auth 
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#6366f1',
                brandAccent: '#4f46e5',
              },
            },
          },
          className: {
            container: 'w-full',
            button: 'w-full py-3 text-base rounded-lg',
          },
        }}
        theme="light"
        providers={["google"]}
        redirectTo={window.location.origin}
        onlyThirdPartyProviders={true}
        view="sign_up"
      />

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onLoginClick}
          className="text-blue-600 hover:underline"
        >
          Log in
        </button>
      </p>
    </div>
  );
};
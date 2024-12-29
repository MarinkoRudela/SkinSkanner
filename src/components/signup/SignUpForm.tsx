import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onLoginClick}
          className="text-blue-600 hover:underline"
        >
          Log in
        </button>
      </p>
    </form>
  );
};
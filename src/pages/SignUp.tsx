import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [planType, setPlanType] = useState("monthly");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    businessName: "",
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            business_name: formData.businessName,
          },
        },
      });

      if (authError) throw authError;

      if (authData.session) {
        const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout-session', {
          body: { 
            email: formData.email,
            planType: planType
          }
        });

        if (checkoutError) throw checkoutError;

        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        } else {
          throw new Error('No checkout URL returned');
        }
      }

    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
      <div className="container max-w-md mx-auto px-4 py-8">
        <Header />
        <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">Business Owner Sign Up</h2>
          <div className="mb-6 space-y-4">
            <RadioGroup
              defaultValue="monthly"
              value={planType}
              onValueChange={setPlanType}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="cursor-pointer">
                  <div className="font-semibold">Monthly Plan</div>
                  <div className="text-sm text-gray-500">$99/month</div>
                  <div className="text-xs text-green-600">30-day free trial</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="lifetime" id="lifetime" />
                <Label htmlFor="lifetime" className="cursor-pointer">
                  <div className="font-semibold">Lifetime Access</div>
                  <div className="text-sm text-gray-500">$1999 one-time</div>
                  <div className="text-xs text-green-600">Best value</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <form onSubmit={handleSignUp} className="space-y-4">
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
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline"
              >
                Log in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
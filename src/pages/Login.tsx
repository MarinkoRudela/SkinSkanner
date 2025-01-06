import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/providers/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { session, isReady, loading } = useAuth();

  useEffect(() => {
    if (isReady && session) {
      navigate("/dashboard");
    }
  }, [isReady, session, navigate]);

  if (!isReady || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
      <Navigation session={session} />
      <div className="container max-w-md mx-auto px-4 py-4 md:py-8">
        <Header />
        <AuthForm />
      </div>
    </div>
  );
};

export default Login;
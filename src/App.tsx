import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "./components/ui/toaster";
import { Support } from "./components/Support";
import { Loader2 } from "lucide-react";
import { initializeWebVitals } from "./utils/performanceMonitoring";
import "./App.css";

// Import the Index page normally since it's the landing page
import Index from "./pages/Index";

// Lazy load all other pages
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Features = lazy(() => import("./pages/Features"));
const BrandedScannerPage = lazy(() => import("./components/scanner/BrandedScannerPage").then(module => ({ default: module.BrandedScannerPage })));
const DemoPage = lazy(() => import("./pages/DemoPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

function App() {
  useEffect(() => {
    initializeWebVitals();
  }, []);

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/features" element={<Features />} />
          <Route path="/b/:shortCode" element={<BrandedScannerPage />} />
          <Route path="/demo" element={<DemoPage />} />
        </Routes>
      </Suspense>
      <Support />
      <Toaster />
    </Router>
  );
}

export default App;
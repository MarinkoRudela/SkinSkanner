import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Features from "./pages/Features";
import { BrandedScannerPage } from "./components/scanner/BrandedScannerPage";
import { DemoPage } from "./pages/DemoPage";
import { Toaster } from "./components/ui/toaster";
import { Support } from "./components/Support";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/features" element={<Features />} />
        <Route path="/b/:shortCode" element={<BrandedScannerPage />} />
        <Route path="/demo" element={<DemoPage />} />
      </Routes>
      <Support />
      <Toaster />
    </Router>
  );
}

export default App;
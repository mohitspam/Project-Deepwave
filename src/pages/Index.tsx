
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import InteractiveGlobe from "@/components/InteractiveGlobe";
import PredictionForm from "@/components/PredictionForm";
import AIPerformanceDashboard from "@/components/AIPerformanceDashboard";
import HistoricalEarthquakes from "@/components/HistoricalEarthquakes";
import LiveDataPanel from "@/components/LiveDataPanel";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-cosmic-gradient">
      <div className="space-grid min-h-screen">
        <Navigation />
        <HeroSection />
        <InteractiveGlobe />
        <div data-section="prediction">
          <PredictionForm />
        </div>
        <AIPerformanceDashboard />
        <HistoricalEarthquakes />
        <LiveDataPanel />
        <Footer />
      </div>
    </div>
  );
};

export default Index;

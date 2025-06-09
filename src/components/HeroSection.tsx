
import { Satellite } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background Earth */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-96 h-96 rounded-full bg-gradient-to-br from-cosmic-blue to-cosmic-blue-dark border-4 border-cosmic-green/30 shadow-2xl">
          {/* Earth surface pattern */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cosmic-blue via-cosmic-blue-dark to-cosmic-black opacity-80" />
          
          {/* Scanning beam */}
          <div className="absolute inset-0 rounded-full border-2 border-cosmic-green animate-scan-beam opacity-60" />
          
          {/* Orbiting satellite */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2">
            <div className="animate-satellite-orbit">
              <Satellite className="w-4 h-4 text-cosmic-green" />
            </div>
          </div>
          
          {/* Ocean scanning lines */}
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1 bg-cosmic-green opacity-50 animate-pulse" />
          <div className="absolute top-1/2 left-1/3 w-1/3 h-1 bg-cosmic-green opacity-50 animate-pulse delay-1000" />
          <div className="absolute top-3/4 left-1/4 w-1/2 h-1 bg-cosmic-green opacity-50 animate-pulse delay-2000" />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-orbitron font-bold neon-text mb-6">
          Project DeepWave
        </h1>
        <h2 className="text-2xl md:text-4xl font-space font-light text-cosmic-silver mb-8">
          Satellite-Assisted Tsunami Predictor
        </h2>
        <p className="text-xl md:text-2xl font-space text-cosmic-green font-medium mb-12">
          Protecting Coasts, One Prediction at a Time
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex items-center space-x-2 text-cosmic-silver">
            <div className="w-2 h-2 bg-cosmic-green rounded-full animate-pulse" />
            <span className="font-space">AI-Powered Prediction</span>
          </div>
          <div className="flex items-center space-x-2 text-cosmic-silver">
            <div className="w-2 h-2 bg-cosmic-green rounded-full animate-pulse delay-1000" />
            <span className="font-space">Real-time Satellite Data</span>
          </div>
          <div className="flex items-center space-x-2 text-cosmic-silver">
            <div className="w-2 h-2 bg-cosmic-green rounded-full animate-pulse delay-2000" />
            <span className="font-space">Global Coverage</span>
          </div>
        </div>
      </div>

      {/* Floating data streams */}
      <div className="absolute top-1/4 left-10 text-cosmic-green font-mono text-xs opacity-60 animate-data-stream">
        SAT_DATA_001: ACTIVE
      </div>
      <div className="absolute top-1/3 right-16 text-cosmic-green font-mono text-xs opacity-60 animate-data-stream delay-1000">
        OCEAN_SCAN: RUNNING
      </div>
      <div className="absolute bottom-1/4 left-20 text-cosmic-green font-mono text-xs opacity-60 animate-data-stream delay-2000">
        AI_MODEL: ONLINE
      </div>
    </section>
  );
};

export default HeroSection;

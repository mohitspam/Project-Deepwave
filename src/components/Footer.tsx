
import { Satellite } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-cosmic-black-light border-t border-cosmic-blue/30 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          {/* Animated satellite broadcasting signals */}
          <div className="relative inline-block mb-6">
            <Satellite className="h-12 w-12 text-cosmic-green animate-pulse-glow" />
            
            {/* Broadcasting signals */}
            <div className="absolute -top-2 -left-2 w-4 h-4">
              <div className="w-2 h-2 bg-cosmic-green rounded-full animate-ping" />
            </div>
            <div className="absolute -top-1 -right-3 w-3 h-3">
              <div className="w-1 h-1 bg-cosmic-blue rounded-full animate-ping delay-500" />
            </div>
            <div className="absolute -bottom-2 -right-1 w-4 h-4">
              <div className="w-2 h-2 bg-cosmic-green rounded-full animate-ping delay-1000" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-orbitron font-bold neon-text">
              Project DeepWave
            </h3>
            <p className="text-cosmic-silver font-space text-lg max-w-2xl mx-auto">
              Advancing tsunami prediction through satellite technology and artificial intelligence. 
              Protecting coastal communities worldwide with cutting-edge early warning systems.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <h4 className="font-orbitron text-cosmic-green mb-4">Technology</h4>
            <ul className="space-y-2 text-cosmic-silver font-space">
              <li>AI-Powered Prediction</li>
              <li>Satellite Data Integration</li>
              <li>Real-time Processing</li>
              <li>Global Coverage</li>
            </ul>
          </div>
          
          <div className="text-center">
            <h4 className="font-orbitron text-cosmic-green mb-4">Partnerships</h4>
            <ul className="space-y-2 text-cosmic-silver font-space">
              <li>NOAA Collaboration</li>
              <li>USGS Data Feed</li>
              <li>International Monitoring</li>
              <li>Research Institutions</li>
            </ul>
          </div>
          
          <div className="text-center">
            <h4 className="font-orbitron text-cosmic-green mb-4">Mission</h4>
            <ul className="space-y-2 text-cosmic-silver font-space">
              <li>Save Lives</li>
              <li>Protect Infrastructure</li>
              <li>Advance Science</li>
              <li>Build Resilience</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cosmic-blue/30 pt-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex items-center space-x-2 text-cosmic-silver">
              <div className="w-2 h-2 bg-cosmic-green rounded-full animate-pulse" />
              <span className="font-space text-sm">Satellite Network: Online</span>
            </div>
            <div className="flex items-center space-x-2 text-cosmic-silver">
              <div className="w-2 h-2 bg-cosmic-blue rounded-full animate-pulse delay-500" />
              <span className="font-space text-sm">AI Model: Active</span>
            </div>
            <div className="flex items-center space-x-2 text-cosmic-silver">
              <div className="w-2 h-2 bg-cosmic-green rounded-full animate-pulse delay-1000" />
              <span className="font-space text-sm">Data Stream: Live</span>
            </div>
          </div>
          
          <p className="text-cosmic-silver/70 font-space text-sm">
            © 2024 Project DeepWave. Protecting Coasts, One Prediction at a Time.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

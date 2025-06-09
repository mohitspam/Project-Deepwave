
import { useState } from "react";
import { Link } from "react-router-dom";
import { Satellite } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Model Accuracy", path: "/model-accuracy" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Simulation", path: "/simulation" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-cosmic-black/80 backdrop-blur-md border-b border-cosmic-blue/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Satellite className="h-8 w-8 text-cosmic-green animate-pulse-glow" />
            <span className="text-xl font-orbitron font-bold neon-text">
              Project DeepWave
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-cosmic-silver hover:text-cosmic-green px-3 py-2 text-sm font-space font-medium transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-cosmic-silver hover:text-cosmic-green"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`h-0.5 bg-current transition-transform ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <div className={`h-0.5 bg-current transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
                <div className={`h-0.5 bg-current transition-transform ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-cosmic-black-light rounded-lg mt-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-cosmic-silver hover:text-cosmic-green block px-3 py-2 text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;


import { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Sphere, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { toast } from 'sonner';

interface GlobeProps {
  onCoordinateClick: (lat: number, lng: number) => void;
}

const EarthSphere = ({ onCoordinateClick }: GlobeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Auto-rotate the globe
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1; // Slow rotation
    }
  });

  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    
    if (!meshRef.current) return;
    
    // Get the intersection point
    const point = event.point;
    
    // Convert 3D point to latitude and longitude
    const radius = 2; // Globe radius
    const x = point.x;
    const y = point.y;
    const z = point.z;
    
    // Calculate latitude and longitude from 3D coordinates
    const lat = Math.asin(y / radius) * (180 / Math.PI);
    const lng = Math.atan2(x, z) * (180 / Math.PI);
    
    onCoordinateClick(lat, lng);
    toast.success(`Coordinates selected: ${lat.toFixed(2)}°, ${lng.toFixed(2)}°`);
  }, [onCoordinateClick]);

  return (
    <Sphere 
      ref={meshRef} 
      args={[2, 64, 64]} 
      onClick={handleClick}
      position={[0, 0, 0]}
    >
      <meshPhongMaterial
        color="#4a90e2"
        transparent={true}
        opacity={0.9}
      >
        {/* Earth-like texture using gradients and patterns */}
        <primitive 
          object={new THREE.DataTexture(
            new Uint8Array([
              // Creating a simple earth-like pattern
              ...Array(256 * 256 * 4).fill(0).map((_, i) => {
                const pixel = Math.floor(i / 4);
                const x = pixel % 256;
                const y = Math.floor(pixel / 256);
                const channel = i % 4;
                
                // Create continent-like patterns
                const noise1 = Math.sin(x * 0.02) * Math.cos(y * 0.03);
                const noise2 = Math.sin(x * 0.01 + y * 0.01) * 0.5;
                const combined = noise1 + noise2;
                
                if (channel === 3) return 255; // Alpha
                
                // Land vs ocean
                if (combined > 0.1) {
                  // Land colors (green/brown)
                  return channel === 0 ? 34 : channel === 1 ? 139 : 34; // Forest green
                } else if (combined > -0.2) {
                  // Coastal areas (lighter green/yellow)
                  return channel === 0 ? 154 : channel === 1 ? 205 : 50;
                } else {
                  // Ocean colors (blue)
                  return channel === 0 ? 25 : channel === 1 ? 25 : 112;
                }
              })
            ]),
            256,
            256
          )}
        />
      </meshPhongMaterial>
    </Sphere>
  );
};

const InteractiveGlobe = () => {
  const [selectedCoords, setSelectedCoords] = useState<{lat: number, lng: number} | null>(null);

  const handleCoordinateClick = useCallback((lat: number, lng: number) => {
    setSelectedCoords({ lat, lng });
    // Here you could trigger navigation to prediction form with coordinates
    console.log('Selected coordinates:', { lat, lng });
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-orbitron font-bold neon-text mb-4">
            Global Ocean Monitoring
          </h2>
          <p className="text-cosmic-silver font-space text-lg mb-8">
            Click anywhere on Earth to get real-time tsunami predictions for that location
          </p>
        </div>

        <div className="relative">
          {/* Globe Container */}
          <div className="h-[600px] w-full rounded-lg overflow-hidden bg-cosmic-black border border-cosmic-blue/30">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              {/* Lighting */}
              <ambientLight intensity={0.3} />
              <directionalLight 
                position={[5, 5, 5]} 
                intensity={1}
                castShadow
              />
              <pointLight position={[-5, -5, -5]} intensity={0.5} />
              
              {/* Stars background */}
              <Stars 
                radius={100} 
                depth={50} 
                count={5000} 
                factor={4} 
                saturation={0} 
                fade 
                speed={1}
              />
              
              {/* Earth Globe */}
              <EarthSphere onCoordinateClick={handleCoordinateClick} />
              
              {/* Controls */}
              <OrbitControls 
                enablePan={false}
                enableZoom={true}
                enableRotate={true}
                minDistance={3}
                maxDistance={12}
                autoRotate={false}
              />
            </Canvas>
          </div>

          {/* Coordinate Display */}
          {selectedCoords && (
            <div className="absolute top-4 right-4 space-card p-4">
              <h3 className="font-orbitron text-cosmic-green text-lg mb-2">
                Selected Location
              </h3>
              <div className="text-cosmic-silver font-mono text-sm">
                <div>Latitude: {selectedCoords.lat.toFixed(4)}°</div>
                <div>Longitude: {selectedCoords.lng.toFixed(4)}°</div>
              </div>
              <button 
                className="cosmic-button mt-3 text-sm py-2 px-4"
                onClick={() => {
                  // Scroll to prediction form or navigate there
                  const predictionForm = document.querySelector('[data-section="prediction"]');
                  if (predictionForm) {
                    predictionForm.scrollIntoView({ behavior: 'smooth' });
                  }
                  toast.info('Scroll down to enter seismic data for prediction');
                }}
              >
                Get Prediction
              </button>
            </div>
          )}

          {/* Info Panel */}
          <div className="absolute bottom-4 left-4 space-card p-4 max-w-sm">
            <div className="text-cosmic-green font-orbitron text-sm mb-2">
              Interactive Controls
            </div>
            <div className="text-cosmic-silver font-space text-xs space-y-1">
              <div>• Click: Select coordinates</div>
              <div>• Drag: Rotate globe</div>
              <div>• Scroll: Zoom in/out</div>
              <div>• Auto-rotation: Always active</div>
            </div>
          </div>
        </div>

        {/* Live Data Indicators */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="space-card text-center">
            <div className="text-cosmic-green text-2xl font-orbitron mb-2">24/7</div>
            <div className="text-cosmic-silver">Global Monitoring</div>
          </div>
          <div className="space-card text-center">
            <div className="text-cosmic-blue text-2xl font-orbitron mb-2">195</div>
            <div className="text-cosmic-silver">Countries Covered</div>
          </div>
          <div className="space-card text-center">
            <div className="text-cosmic-purple text-2xl font-orbitron mb-2">&lt;30s</div>
            <div className="text-cosmic-silver">Response Time</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveGlobe;

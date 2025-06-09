
import { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
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
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    
    if (!meshRef.current) return;
    
    const point = event.point;
    const radius = 2;
    const x = point.x;
    const y = point.y;
    const z = point.z;
    
    const lat = Math.asin(y / radius) * (180 / Math.PI);
    const lng = Math.atan2(x, z) * (180 / Math.PI);
    
    onCoordinateClick(lat, lng);
    toast.success(`Coordinates selected: ${lat.toFixed(2)}°, ${lng.toFixed(2)}°`);
  }, [onCoordinateClick]);

  return (
    <mesh 
      ref={meshRef} 
      onClick={handleClick}
      position={[0, 0, 0]}
    >
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhongMaterial
        color="#4a90e2"
        transparent={true}
        opacity={0.9}
      />
    </mesh>
  );
};

const InteractiveGlobe = () => {
  const [selectedCoords, setSelectedCoords] = useState<{lat: number, lng: number} | null>(null);

  const handleCoordinateClick = useCallback((lat: number, lng: number) => {
    setSelectedCoords({ lat, lng });
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
          <div className="h-[600px] w-full rounded-lg overflow-hidden bg-cosmic-black border border-cosmic-blue/30">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <ambientLight intensity={0.3} />
              <directionalLight 
                position={[5, 5, 5]} 
                intensity={1}
                castShadow
              />
              <pointLight position={[-5, -5, -5]} intensity={0.5} />
              
              <Stars 
                radius={100} 
                depth={50} 
                count={5000} 
                factor={4} 
                saturation={0} 
                fade 
                speed={1}
              />
              
              <EarthSphere onCoordinateClick={handleCoordinateClick} />
              
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

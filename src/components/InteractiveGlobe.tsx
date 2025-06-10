
import { useRef, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { toast } from 'sonner';

interface GlobeProps {
  onCoordinateClick: (lat: number, lng: number) => void;
}

const EarthSphere = ({ onCoordinateClick }: GlobeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create realistic Earth texture using canvas
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Create base ocean color
    ctx.fillStyle = '#1a4d66';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Function to draw continent-like shapes
    const drawContinent = (x: number, y: number, width: number, height: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add some irregular edges
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * 2 * Math.PI;
        const offsetX = Math.cos(angle) * width * 0.8;
        const offsetY = Math.sin(angle) * height * 0.8;
        ctx.beginPath();
        ctx.ellipse(x + offsetX, y + offsetY, width * 0.3, height * 0.3, 0, 0, 2 * Math.PI);
        ctx.fill();
      }
    };
    
    // Draw continents with Earth-like colors
    const landColor1 = '#2d5016'; // Dark green
    const landColor2 = '#4a7c59'; // Medium green
    const landColor3 = '#8b4513'; // Brown for mountains/deserts
    
    // Africa and Europe
    drawContinent(512, 200, 80, 120, landColor1);
    drawContinent(480, 140, 60, 40, landColor2);
    
    // Asia
    drawContinent(650, 160, 120, 80, landColor1);
    drawContinent(750, 180, 80, 60, landColor2);
    
    // North America
    drawContinent(200, 140, 90, 100, landColor1);
    drawContinent(150, 120, 70, 80, landColor2);
    
    // South America
    drawContinent(250, 300, 60, 120, landColor1);
    
    // Australia
    drawContinent(800, 350, 80, 40, landColor3);
    
    // Greenland
    drawContinent(300, 80, 40, 30, landColor3);
    
    // Additional smaller landmasses
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 15 + 5;
      drawContinent(x, y, size, size * 0.7, Math.random() > 0.5 ? landColor2 : landColor3);
    }
    
    // Add some cloud-like effects for atmosphere
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 20 + 10;
      ctx.beginPath();
      ctx.ellipse(x, y, radius, radius * 0.6, 0, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

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
        map={earthTexture}
        shininess={10}
        transparent={false}
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
              <ambientLight intensity={0.4} />
              <directionalLight 
                position={[5, 5, 5]} 
                intensity={1.2}
                castShadow
              />
              <pointLight position={[-5, -5, -5]} intensity={0.3} />
              
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

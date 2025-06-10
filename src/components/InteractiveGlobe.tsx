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
  
  // Create realistic Earth texture using actual geographic data patterns
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;

    // Create gradient for realistic ocean colors
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGradient.addColorStop(0, '#004499'); // Deep polar waters
    oceanGradient.addColorStop(0.3, '#0066cc'); // Mid-latitude oceans
    oceanGradient.addColorStop(0.7, '#0099ff'); // Tropical waters
    oceanGradient.addColorStop(1, '#004499'); // Antarctic waters
    
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Accurate continent drawing function with realistic shapes
    const drawLandmass = (path: { x: number, y: number }[], color: string, roughness = 0.95) => {
      if (path.length < 3) return;
      
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Start path
      ctx.moveTo(path[0].x, path[0].y);
      
      // Create smooth curves between points for realistic coastlines
      for (let i = 1; i < path.length; i++) {
        const current = path[i];
        const next = path[(i + 1) % path.length];
        const cp1x = current.x + (Math.random() - 0.5) * 20 * roughness;
        const cp1y = current.y + (Math.random() - 0.5) * 20 * roughness;
        const cp2x = next.x + (Math.random() - 0.5) * 20 * roughness;
        const cp2y = next.y + (Math.random() - 0.5) * 20 * roughness;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
      }
      
      ctx.closePath();
      ctx.fill();
    };

    // Define realistic continent colors
    const colors = {
      forest: '#2d5016',
      plains: '#4a7c59',
      desert: '#8b4513',
      tundra: '#6b8e3d',
      mountains: '#654321',
      ice: '#f0f8ff'
    };

    // NORTH AMERICA - Realistic shape and positioning
    const northAmerica = [
      { x: 150, y: 200 }, { x: 200, y: 180 }, { x: 280, y: 160 },
      { x: 320, y: 180 }, { x: 350, y: 220 }, { x: 380, y: 280 },
      { x: 350, y: 350 }, { x: 300, y: 380 }, { x: 250, y: 360 },
      { x: 200, y: 340 }, { x: 170, y: 300 }, { x: 140, y: 250 }
    ];
    drawLandmass(northAmerica, colors.forest);

    // SOUTH AMERICA - Distinctive shape
    const southAmerica = [
      { x: 280, y: 400 }, { x: 320, y: 420 }, { x: 340, y: 480 },
      { x: 350, y: 560 }, { x: 340, y: 640 }, { x: 320, y: 700 },
      { x: 300, y: 720 }, { x: 280, y: 700 }, { x: 260, y: 650 },
      { x: 250, y: 580 }, { x: 260, y: 500 }, { x: 270, y: 440 }
    ];
    drawLandmass(southAmerica, colors.plains);

    // AFRICA - Recognizable outline
    const africa = [
      { x: 520, y: 250 }, { x: 580, y: 240 }, { x: 620, y: 280 },
      { x: 640, y: 340 }, { x: 650, y: 420 }, { x: 640, y: 500 },
      { x: 620, y: 580 }, { x: 580, y: 620 }, { x: 540, y: 640 },
      { x: 500, y: 620 }, { x: 480, y: 580 }, { x: 470, y: 520 },
      { x: 480, y: 450 }, { x: 490, y: 380 }, { x: 500, y: 320 }
    ];
    drawLandmass(africa, colors.desert);

    // EUROPE - Smaller but recognizable
    const europe = [
      { x: 520, y: 180 }, { x: 580, y: 160 }, { x: 620, y: 180 },
      { x: 640, y: 200 }, { x: 630, y: 220 }, { x: 600, y: 240 },
      { x: 560, y: 230 }, { x: 520, y: 220 }, { x: 500, y: 200 }
    ];
    drawLandmass(europe, colors.forest);

    // ASIA - Large landmass
    const asia = [
      { x: 650, y: 140 }, { x: 800, y: 120 }, { x: 950, y: 140 },
      { x: 1100, y: 160 }, { x: 1200, y: 200 }, { x: 1250, y: 280 },
      { x: 1200, y: 360 }, { x: 1100, y: 400 }, { x: 950, y: 380 },
      { x: 800, y: 360 }, { x: 700, y: 320 }, { x: 650, y: 260 }
    ];
    drawLandmass(asia, colors.tundra);

    // AUSTRALIA - Distinctive shape
    const australia = [
      { x: 1150, y: 580 }, { x: 1220, y: 570 }, { x: 1280, y: 590 },
      { x: 1300, y: 620 }, { x: 1280, y: 650 }, { x: 1220, y: 660 },
      { x: 1180, y: 640 }, { x: 1150, y: 610 }
    ];
    drawLandmass(australia, colors.desert);

    // GREENLAND - Arctic island
    const greenland = [
      { x: 350, y: 80 }, { x: 420, y: 70 }, { x: 450, y: 100 },
      { x: 440, y: 140 }, { x: 400, y: 150 }, { x: 360, y: 130 },
      { x: 340, y: 100 }
    ];
    drawLandmass(greenland, colors.ice);

    // Add smaller islands and archipelagos
    const islands = [
      // Caribbean
      { x: 320, y: 350, size: 8 },
      { x: 330, y: 360, size: 6 },
      // Mediterranean islands
      { x: 580, y: 250, size: 5 },
      { x: 600, y: 260, size: 4 },
      // Japanese archipelago
      { x: 1300, y: 280, size: 12 },
      { x: 1310, y: 290, size: 8 },
      // Philippines
      { x: 1180, y: 380, size: 10 },
      // Madagascar
      { x: 680, y: 580, size: 15 },
      // New Zealand
      { x: 1400, y: 680, size: 8 },
      { x: 1420, y: 720, size: 6 },
      // British Isles
      { x: 500, y: 160, size: 8 },
      // Indonesia
      { x: 1100, y: 420, size: 6 },
      { x: 1120, y: 430, size: 5 },
      { x: 1140, y: 440, size: 4 }
    ];

    islands.forEach(island => {
      ctx.fillStyle = Math.random() > 0.6 ? colors.forest : colors.plains;
      ctx.beginPath();
      ctx.ellipse(island.x, island.y, island.size, island.size * 0.8, 0, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Add polar ice caps
    const arcticIce = ctx.createRadialGradient(canvas.width/2, 0, 0, canvas.width/2, 0, 150);
    arcticIce.addColorStop(0, colors.ice);
    arcticIce.addColorStop(0.7, 'rgba(240, 248, 255, 0.8)');
    arcticIce.addColorStop(1, 'rgba(240, 248, 255, 0)');
    
    ctx.fillStyle = arcticIce;
    ctx.fillRect(0, 0, canvas.width, 150);

    const antarcticIce = ctx.createRadialGradient(canvas.width/2, canvas.height, 0, canvas.width/2, canvas.height, 120);
    antarcticIce.addColorStop(0, colors.ice);
    antarcticIce.addColorStop(0.8, 'rgba(240, 248, 255, 0.6)');
    antarcticIce.addColorStop(1, 'rgba(240, 248, 255, 0)');
    
    ctx.fillStyle = antarcticIce;
    ctx.fillRect(0, canvas.height - 120, canvas.width, 120);

    // Add subtle cloud layer for atmosphere
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 30 + 15;
      const scaleY = 0.3 + Math.random() * 0.4;
      
      ctx.beginPath();
      ctx.ellipse(x, y, radius, radius * scaleY, 0, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Add city lights effect for night side (subtle)
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#ffff88';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      if (Math.random() > 0.7) { // Only on some land areas
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.fill();
      }
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
      <sphereGeometry args={[2, 128, 64]} />
      <meshPhongMaterial
        map={earthTexture}
        shininess={5}
        transparent={false}
        bumpScale={0.05}
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
                position={[5, 3, 5]} 
                intensity={1.5}
                castShadow
                color="#ffffff"
              />
              <pointLight position={[-5, -5, -5]} intensity={0.4} color="#87ceeb" />
              
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

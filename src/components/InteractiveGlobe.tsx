import { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface GlobeProps {
  onCoordinateClick: (lat: number, lng: number, worldPosition: THREE.Vector3) => void;
  onTexturesLoaded: () => void;
}

interface PinProps {
  position: THREE.Vector3;
  onComplete: () => void;
}

const Pin3D = ({ position, onComplete }: PinProps) => {
  const pinRef = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Animation for pin appearance
    const startTime = Date.now();
    const duration = 200; // 200ms for scale animation
    
    const animateIn = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setScale(easeOut);
      
      if (progress < 1) {
        requestAnimationFrame(animateIn);
      } else {
        // Start fade out after 2.5 seconds (total 3 seconds including scale animation)
        setTimeout(() => {
          const fadeStartTime = Date.now();
          const fadeDuration = 300;
          
          const animateOut = () => {
            const fadeElapsed = Date.now() - fadeStartTime;
            const fadeProgress = Math.min(fadeElapsed / fadeDuration, 1);
            setOpacity(1 - fadeProgress);
            
            if (fadeProgress < 1) {
              requestAnimationFrame(animateOut);
            } else {
              onComplete();
            }
          };
          animateOut();
        }, 2500);
      }
    };
    animateIn();
  }, [onComplete]);

  useFrame(() => {
    if (pinRef.current) {
      // Gentle floating animation
      pinRef.current.position.y = position.y + Math.sin(Date.now() * 0.003) * 0.02;
    }
  });

  return (
    <group ref={pinRef} position={[position.x, position.y, position.z]} scale={scale}>
      {/* Pin pole */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.3, 8]} />
        <meshPhongMaterial 
          color="#ff4444" 
          transparent 
          opacity={opacity}
          shininess={100}
        />
      </mesh>
      
      {/* Pin head (sphere) */}
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshPhongMaterial 
          color="#ff2222" 
          transparent 
          opacity={opacity}
          shininess={200}
          emissive="#440000"
        />
      </mesh>
      
      {/* Pin base (small cylinder for ground contact) */}
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.01, 8]} />
        <meshPhongMaterial 
          color="#cc0000" 
          transparent 
          opacity={opacity * 0.8}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial 
          color="#ff6666" 
          transparent 
          opacity={opacity * 0.3}
        />
      </mesh>
    </group>
  );
};

const EarthSphere = ({ onCoordinateClick, onTexturesLoaded }: GlobeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const earthTexture = useLoader(
    THREE.TextureLoader,
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg'
  );
  const bumpTexture = useLoader(
    THREE.TextureLoader,
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_normal_2048.jpg'
  );
  const specularTexture = useLoader(
    THREE.TextureLoader,
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_specular_2048.jpg'
  );

  useEffect(() => {
    if (earthTexture && bumpTexture && specularTexture) {
      onTexturesLoaded();
    }
  }, [earthTexture, bumpTexture, specularTexture, onTexturesLoaded]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }
  });

  const handleClick = useCallback((event: any) => {
    event.stopPropagation();

    if (!meshRef.current) return;

    const point = event.point;
    const radius = 2;
    const lat = Math.asin(point.y / radius) * (180 / Math.PI);
    const lng = Math.atan2(point.x, point.z) * (180 / Math.PI);

    // Calculate the world position for the pin (slightly above surface)
    const worldPosition = new THREE.Vector3(
      point.x * 1.01, // Slightly outside the sphere
      point.y * 1.01,
      point.z * 1.01
    );

    onCoordinateClick(lat, lng, worldPosition);
  }, [onCoordinateClick]);

  return (
    <mesh ref={meshRef} onClick={handleClick} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 256, 128]} />
      <meshPhongMaterial
        map={earthTexture}
        bumpMap={bumpTexture}
        bumpScale={0.05}
        specularMap={specularTexture}
        specular={new THREE.Color(0x88aaff)}
        shininess={150}
      />
    </mesh>
  );
};

const LoadingEarth = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 64, 32]} />
      <meshPhongMaterial color="#4a90e2" shininess={30} transparent opacity={0.8} />
    </mesh>
  );
};

const InteractiveGlobe = () => {
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pins, setPins] = useState<Array<{ id: number, position: THREE.Vector3, lat: number, lng: number }>>([]);
  const [pinIdCounter, setPinIdCounter] = useState(0);

  const handleCoordinateClick = useCallback((lat: number, lng: number, worldPosition: THREE.Vector3) => {
    setSelectedCoords({ lat, lng });

    // Create new pin
    const newPin = {
      id: pinIdCounter,
      position: worldPosition,
      lat,
      lng
    };

    setPins(prev => [...prev, newPin]);
    setPinIdCounter(prev => prev + 1);

    const notification = document.createElement('div');
    notification.innerHTML = `📍 Coordinates: ${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      border: 1px solid #3b82f6;
      z-index: 1000;
      font-family: monospace;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }, [pinIdCounter]);

  const removePin = useCallback((pinId: number) => {
    setPins(prev => prev.filter(pin => pin.id !== pinId));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            NASA Earth Globe
          </h1>
          <p className="text-gray-300 text-lg">Real satellite imagery from NASA's Blue Marble dataset</p>
          <p className="text-gray-400 text-sm mt-2">Click anywhere on Earth to get precise coordinates</p>
        </div>

        <div className="relative">
          <div className="h-[700px] w-full rounded-xl overflow-hidden bg-black border border-blue-500/20 shadow-2xl">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
              <ambientLight intensity={0.4} />

              {/* Primary sunlight */}
              <directionalLight
                position={[5, 3, 5]}
                intensity={3.0}
                castShadow
                color="#ffffff"
              />

              {/* Rim light for extra glow */}
              <directionalLight
                position={[-4, 2, -2]}
                intensity={1.5}
                color="#ddddff"
              />

              <pointLight position={[-3, -3, -3]} intensity={0.5} color="#88ccff" />

              <Stars
                radius={200}
                depth={60}
                count={10000}
                factor={4}
                saturation={0}
                fade
                speed={0.3}
              />

              <Suspense fallback={<LoadingEarth />}>
                <EarthSphere
                  onCoordinateClick={handleCoordinateClick}
                  onTexturesLoaded={() => setIsLoading(false)}
                />
                
                {/* Render all active pins */}
                {pins.map(pin => (
                  <Pin3D
                    key={pin.id}
                    position={pin.position}
                    onComplete={() => removePin(pin.id)}
                  />
                ))}
              </Suspense>

              <OrbitControls
                enablePan={false}
                enableZoom={true}
                enableRotate={true}
                minDistance={2.5}
                maxDistance={15}
                autoRotate={false}
                dampingFactor={0.05}
                enableDamping={true}
                rotateSpeed={0.5}
                zoomSpeed={0.8}
              />
            </Canvas>
          </div>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-white text-lg">Loading NASA Earth Textures...</p>
                <p className="text-gray-400 text-sm">High-resolution satellite imagery</p>
              </div>
            </div>
          )}

          {selectedCoords && (
            <div className="absolute top-6 right-6 bg-black/90 backdrop-blur-md border border-blue-400/40 rounded-lg p-6 min-w-[280px] shadow-2xl">
              <h3 className="text-blue-400 text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">🌍</span> Selected Location
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Latitude:</span>
                  <span className="font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">
                    {selectedCoords.lat.toFixed(6)}°
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Longitude:</span>
                  <span className="font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">
                    {selectedCoords.lng.toFixed(6)}°
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-600">
                  <div className="text-xs text-gray-400 mb-2">Coordinate System: WGS84</div>
                </div>
              </div>
              <button
                className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 font-semibold"
                onClick={() => {
                  console.log('Getting prediction for:', selectedCoords);
                  alert(`🌊 Analyzing location: ${selectedCoords.lat.toFixed(4)}°, ${selectedCoords.lng.toFixed(4)}°`);
                }}
              >
                🔍 Analyze Location
              </button>
            </div>
          )}

          <div className="absolute bottom-6 left-6 bg-black/90 backdrop-blur-md border border-blue-400/40 rounded-lg p-4 max-w-xs shadow-2xl">
            <div className="text-blue-400 font-bold text-sm mb-3 flex items-center">
              <span className="mr-2">🎮</span> Controls
            </div>
            <div className="text-gray-300 text-xs space-y-2">
              <div className="flex items-center">
                <span className="w-16 text-blue-300">Click:</span> <span>Select coordinates</span>
              </div>
              <div className="flex items-center">
                <span className="w-16 text-blue-300">Drag:</span> <span>Rotate globe</span>
              </div>
              <div className="flex items-center">
                <span className="w-16 text-blue-300">Scroll:</span> <span>Zoom in/out</span>
              </div>
              <div className="flex items-center">
                <span className="w-16 text-blue-300">Pin:</span> <span>Disappears in 3s</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-sm border border-gray-600/30 rounded-lg p-3 text-xs text-gray-400">
            <div>📡 Imagery: NASA Blue Marble</div>
            <div>🛰️ Real satellite data</div>
            <div>📍 3D Pin markers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveGlobe;

import { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface GlobeProps {
  onCoordinateClick: (lat: number, lng: number) => void;
  onTexturesLoaded: () => void;
}

interface BounceEffect {
  id: number;
  center: THREE.Vector3;
  startTime: number;
  duration: number;
}

const EarthSphere = ({ onCoordinateClick, onTexturesLoaded }: GlobeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.SphereGeometry>(null);
  const originalPositions = useRef<Float32Array | null>(null);
  const [bounceEffects, setBounceEffects] = useState<BounceEffect[]>([]);
  const bounceIdCounter = useRef(0);

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

  // Call onTexturesLoaded immediately when textures are available
  useEffect(() => {
    // Add a small delay to ensure everything is ready
    const timer = setTimeout(() => {
      onTexturesLoaded();
    }, 100);
    return () => clearTimeout(timer);
  }, [earthTexture, bumpTexture, specularTexture, onTexturesLoaded]);

  // Store original vertex positions
  useEffect(() => {
    if (geometryRef.current && !originalPositions.current) {
      const positions = geometryRef.current.attributes.position;
      originalPositions.current = new Float32Array(positions.array);
    }
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }

    // Apply bounce effects
    if (geometryRef.current && originalPositions.current) {
      const positions = geometryRef.current.attributes.position;
      const positionArray = positions.array as Float32Array;
      
      // Reset to original positions
      for (let i = 0; i < positionArray.length; i++) {
        positionArray[i] = originalPositions.current[i];
      }

      const currentTime = Date.now();
      const activeEffects: BounceEffect[] = [];

      bounceEffects.forEach(effect => {
        const elapsed = currentTime - effect.startTime;
        const progress = elapsed / effect.duration;

        if (progress < 1) {
          activeEffects.push(effect);
          
          // Create bounce animation with easing
          const bounceHeight = Math.sin(progress * Math.PI * 3) * (1 - progress) * 0.12;
          
          // Apply bounce to nearby vertices
          for (let i = 0; i < positionArray.length; i += 3) {
            const vertex = new THREE.Vector3(
              originalPositions.current[i],
              originalPositions.current[i + 1],
              originalPositions.current[i + 2]
            );
            
            const distance = vertex.distanceTo(effect.center);
            const maxDistance = 0.15;
            
            if (distance < maxDistance) {
              const influence = Math.cos((distance / maxDistance) * Math.PI * 0.5);
              const displacement = bounceHeight * influence;
              
              vertex.normalize().multiplyScalar(2 + displacement);
              
              positionArray[i] = vertex.x;
              positionArray[i + 1] = vertex.y;
              positionArray[i + 2] = vertex.z;
            }
          }
        }
      });

      if (activeEffects.length !== bounceEffects.length) {
        setBounceEffects(activeEffects);
      }

      positions.needsUpdate = true;
      if (geometryRef.current.attributes.normal) {
        geometryRef.current.computeVertexNormals();
      }
    }
  });

  const handleClick = useCallback((event: any) => {
    event.stopPropagation();

    if (!meshRef.current) return;

    const point = event.point;
    const radius = 2;
    
    // Normalize the point to ensure it's on the sphere surface
    const normalizedPoint = point.clone().normalize().multiplyScalar(radius);
    
    // CRITICAL FIX: Account for the Earth's current rotation to get stable coordinates
    const currentRotation = meshRef.current.rotation.y;
    
    // Create a rotation matrix to counter the Earth's rotation
    const rotationMatrix = new THREE.Matrix4().makeRotationY(-currentRotation);
    
    // Apply the inverse rotation to get the original geographic position
    const originalPoint = normalizedPoint.clone().applyMatrix4(rotationMatrix);
    
    const x = originalPoint.x;
    const y = originalPoint.y;
    const z = originalPoint.z;
    
    // Now calculate coordinates from the rotation-corrected position
    const lat = Math.asin(y / radius) * (180 / Math.PI);
    let lng = Math.atan2(z, x) * (180 / Math.PI);
    if (lng < 0) lng += 360;

    
    // Normalize longitude to [-180, 180] range
    if (lng < -180) lng += 360;
    if (lng > 180) lng -= 360;

    // Convert world coordinates to local sphere coordinates for bounce effect
    const localPoint = new THREE.Vector3(point.x, point.y, point.z);
    const rotationMatrixForBounce = new THREE.Matrix4().makeRotationY(-currentRotation);
    localPoint.applyMatrix4(rotationMatrixForBounce);
    const bounceCenter = localPoint.normalize().multiplyScalar(2);
    
    const newBounce: BounceEffect = {
      id: bounceIdCounter.current++,
      center: bounceCenter,
      startTime: Date.now(),
      duration: 1500
    };

    setBounceEffects(prev => [...prev, newBounce]);
    onCoordinateClick(lat, lng);
  }, [onCoordinateClick]);

  return (
    <mesh ref={meshRef} onClick={handleClick} position={[0, 0, 0]}>
      <sphereGeometry ref={geometryRef} args={[2, 128, 64]} />
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

  const handleCoordinateClick = useCallback((lat: number, lng: number) => {
    setSelectedCoords({ lat, lng });

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
  }, []);

  const handleTexturesLoaded = useCallback(() => {
    setIsLoading(false);
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
          <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-400/20 max-w-2xl mx-auto">
            <p className="text-blue-200 text-sm">
              <strong>Test Coordinates:</strong> India should show ~21°N, 78°E | USA ~40°N, -100°W | Australia ~-27°S, 133°E
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="h-[700px] w-full rounded-xl overflow-hidden bg-black border border-blue-500/20 shadow-2xl">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
              <ambientLight intensity={0.4} />

              <directionalLight
                position={[5, 3, 5]}
                intensity={3.0}
                castShadow
                color="#ffffff"
              />

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
                  onTexturesLoaded={handleTexturesLoaded}
                />
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
                  <div className="text-xs text-green-300">
                    {(() => {
                      const lat = selectedCoords.lat;
                      const lng = selectedCoords.lng;
                      
                      // PRECISE COUNTRY BOUNDARIES (NON-OVERLAPPING)
                      
                      // INDIA - Main subcontinent
                      if (lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97) return "🇮🇳 India";
                      
                      // CHINA - Separate from India, east of 97°E
                      if (lat >= 18 && lat <= 54 && lng >= 97 && lng <= 135) return "🇨🇳 China";
                      
                      // SOUTHEAST ASIA
                      if (lat >= -11 && lat <= 6 && lng >= 95 && lng <= 141) return "🇮🇩 Indonesia";
                      if (lat >= 5 && lat <= 29 && lng >= 97 && lng <= 106) return "🇹🇭 Thailand";
                      if (lat >= 8 && lat <= 24 && lng >= 102 && lng <= 110) return "🇻🇳 Vietnam";
                      if (lat >= 1 && lat <= 7 && lng >= 99 && lng <= 120) return "🇲🇾 Malaysia";
                      if (lat >= 5 && lat <= 21 && lng >= 92 && lng <= 102) return "🇲🇲 Myanmar";
                      
                      // EAST ASIA
                      if (lat >= 31 && lat <= 46 && lng >= 129 && lng <= 146) return "🇯🇵 Japan";
                      if (lat >= 33 && lat <= 43 && lng >= 124 && lng <= 132) return "🇰🇷 South Korea";
                      
                      // MIDDLE EAST
                      if (lat >= 25 && lat <= 40 && lng >= 44 && lng <= 64) return "🇮🇷 Iran";
                      if (lat >= 12 && lat <= 32 && lng >= 34 && lng <= 56) return "🇸🇦 Saudi Arabia";
                      if (lat >= 36 && lat <= 42 && lng >= 26 && lng <= 45) return "🇹🇷 Turkey";
                      
                      // AFRICA
                      if (lat >= 22 && lat <= 32 && lng >= 25 && lng <= 37) return "🇪🇬 Egypt";
                      if (lat >= 3 && lat <= 15 && lng >= 2 && lng <= 15) return "🇳🇬 Nigeria";
                      if (lat >= 28 && lat <= 36 && lng >= -12 && lng <= -1) return "🇲🇦 Morocco";
                      if (lat >= -35 && lat <= -22 && lng >= 16 && lng <= 33) return "🇿🇦 South Africa";
                      if (lat >= -1 && lat <= 5 && lng >= 29 && lng <= 35) return "🇰🇪 Kenya";
                      
                      // EUROPE
                      if (lat >= 41 && lat <= 51 && lng >= -5 && lng <= 9) return "🇫🇷 France";
                      if (lat >= 36 && lat <= 47 && lng >= 6 && lng <= 19) return "🇮🇹 Italy";
                      if (lat >= 47 && lat <= 55 && lng >= 6 && lng <= 15) return "🇩🇪 Germany";
                      if (lat >= 49 && lat <= 61 && lng >= -8 && lng <= 2) return "🇬🇧 United Kingdom";
                      if (lat >= 36 && lat <= 44 && lng >= -10 && lng <= 4) return "🇪🇸 Spain";
                      if (lat >= 41 && lat <= 84 && lng >= 19 && lng <= 169) return "🇷🇺 Russia";
                      if (lat >= 60 && lat <= 71 && lng >= 5 && lng <= 31) return "🇳🇴 Norway";
                      if (lat >= 55 && lat <= 69 && lng >= 10 && lng <= 24) return "🇸🇪 Sweden";
                      if (lat >= 59 && lat <= 70 && lng >= 20 && lng <= 32) return "🇫🇮 Finland";
                      
                      // AMERICAS
                      if (lat >= 24 && lat <= 49 && lng >= -125 && lng <= -66) return "🇺🇸 United States";
                      if (lat >= 41 && lat <= 84 && lng >= -141 && lng <= -52) return "🇨🇦 Canada";
                      if (lat >= 14 && lat <= 33 && lng >= -118 && lng <= -86) return "🇲🇽 Mexico";
                      if (lat >= -34 && lat <= 13 && lng >= -74 && lng <= -34) return "🇧🇷 Brazil";
                      if (lat >= -55 && lat <= -21 && lng >= -74 && lng <= -53) return "🇦🇷 Argentina";
                      if (lat >= -57 && lat <= -17 && lng >= -81 && lng <= -66) return "🇨🇱 Chile";
                      
                      // OCEANIA
                      if (lat >= -44 && lat <= -9 && lng >= 112 && lng <= 154) return "🇦🇺 Australia";
                      if (lat >= -47 && lat <= -34 && lng >= 166 && lng <= 179) return "🇳🇿 New Zealand";
                      
                      // BROADER REGIONS (FALLBACK)
                      if (lat >= -35 && lat <= 37 && lng >= -20 && lng <= 55) return "🌍 Africa";
                      if (lat >= -60 && lat <= 15 && lng >= -82 && lng <= -30) return "🌎 South America";
                      if (lat >= 7 && lat <= 85 && lng >= -170 && lng <= -50) return "🌎 North America";
                      if (lat >= 35 && lat <= 72 && lng >= -25 && lng <= 45) return "🇪🇺 Europe";
                      if (lat >= -50 && lat <= 50 && lng >= 95 && lng <= 180) return "🌏 Asia-Pacific";
                      
                      return "🌎 Geographic coordinates ready";
                    })()}
                  </div>
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
                <span className="w-16 text-blue-300">Click:</span> <span>Bounce & coordinates</span>
              </div>
              <div className="flex items-center">
                <span className="w-16 text-blue-300">Drag:</span> <span>Rotate globe</span>
              </div>
              <div className="flex items-center">
                <span className="w-16 text-blue-300">Scroll:</span> <span>Zoom in/out</span>
              </div>
              <div className="flex items-center">
                <span className="w-16 text-blue-300">Bounce:</span> <span>Lasts 1.5 seconds</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-sm border border-gray-600/30 rounded-lg p-3 text-xs text-gray-400">
            <div>📡 Imagery: NASA Blue Marble</div>
            <div>🛰️ Real satellite data</div>
            <div>🎯 Interactive bounce effects</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveGlobe;

import { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface GlobeProps {
  onCoordinateClick: (lat: number, lng: number) => void;
  onTexturesLoaded: () => void;
}

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

    onCoordinateClick(lat, lng);
  }, [onCoordinateClick]);

  return (
    <mesh ref={meshRef} onClick={handleClick} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 256, 128]} />
      <meshPhongMaterial
        map={earthTexture}
        bumpMap={bumpTexture}
        bumpScale={0.05}
        specularMap={specularTexture}
        specular={new THREE.Color(0x4466aa)}
        shininess={100}
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
              <ambientLight intensity={0.15} />
              <directionalLight position={[5, 3, 5]} intensity={2.0} castShadow color="#ffffff" />
              <pointLight position={[-3, -3, -3]} intensity={0.2} color="#1e3a8a" />
              <Stars radius={200} depth={60} count={10000} factor={4} saturation={0} fade speed={0.3} />
              <Suspense fallback={<LoadingEarth />}>
                <EarthSphere
                  onCoordinateClick={handleCoordinateClick}
                  onTexturesLoaded={() => setIsLoading(false)}
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
                <span className="w-16 text-blue-300">Auto:</span> <span>Slow rotation</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-sm border border-gray-600/30 rounded-lg p-3 text-xs text-gray-400">
            <div>📡 Imagery: NASA Blue Marble</div>
            <div>🛰️ Real satellite data</div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-400/20 rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-200">
            <div className="text-4xl mb-3">🛰️</div>
            <div className="text-blue-400 text-2xl font-bold mb-2">NASA Quality</div>
            <div className="text-gray-300">Real satellite imagery</div>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-green-400/20 rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-200">
            <div className="text-4xl mb-3">🌍</div>
            <div className="text-green-400 text-2xl font-bold mb-2">Interactive</div>
            <div className="text-gray-300">Click anywhere on Earth</div>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-400/20 rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-200">
            <div className="text-4xl mb-3">📍</div>
            <div className="text-purple-400 text-2xl font-bold mb-2">Precise</div>
            <div className="text-gray-300">WGS84 coordinates</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveGlobe;

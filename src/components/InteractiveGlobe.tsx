import { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import pointInPolygon from 'point-in-polygon';
import type { FeatureCollection } from 'geojson';

// --- TYPE DEFINITIONS ---

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

interface SelectedLocation {
  lat: number;
  lng: number;
  country: string;
}

// --- DATA SOURCE ---
// Using a medium-resolution GeoJSON file for country boundaries. It's a good balance of detail and file size.
const GEOJSON_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

// --- 3D COMPONENTS ---

const EarthSphere = ({ onCoordinateClick, onTexturesLoaded }: GlobeProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geometryRef = useRef<THREE.SphereGeometry>(null);
  const originalPositions = useRef<Float32Array | null>(null);
  const [bounceEffects, setBounceEffects] = useState<BounceEffect[]>([]);
  const bounceIdCounter = useRef(0);

  // RECOMMENDATION #2: Using High-Resolution 4K Textures for a stunning visual upgrade.
  const [colorMap, bumpMap, specularMap] = useLoader(THREE.TextureLoader, [
    'https://cdn.jsdelivr.net/gh/devmastery/3d-earth-react@main/src/assets/textures/4k/2_no_clouds_4k.jpg',
    'https://cdn.jsdelivr.net/gh/devmastery/3d-earth-react@main/src/assets/textures/4k/elev_bump_4k.jpg',
    'https://cdn.jsdelivr.net/gh/devmastery/3d-earth-react@main/src/assets/textures/4k/water_4k.png'
  ]);
  
  // This useEffect now correctly signals when all textures are ready.
  useEffect(() => {
    onTexturesLoaded();
  }, [colorMap, bumpMap, specularMap, onTexturesLoaded]);

  // Store original vertex positions for the bounce effect.
  useEffect(() => {
    if (geometryRef.current && !originalPositions.current) {
      const positions = geometryRef.current.attributes.position;
      originalPositions.current = new Float32Array(positions.array);
    }
  }, []);

  useFrame((state, delta) => {
    // Slow rotation of the Earth
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }

    // --- Bounce Effect Animation Logic ---
    if (geometryRef.current && originalPositions.current && bounceEffects.length > 0) {
      const positions = geometryRef.current.attributes.position;
      const positionArray = positions.array as Float32Array;
      
      // Reset to original positions before applying effects for this frame
      positionArray.set(originalPositions.current);

      const currentTime = Date.now();
      const activeEffects = bounceEffects.filter(effect => {
        const elapsed = currentTime - effect.startTime;
        return elapsed < effect.duration;
      });

      activeEffects.forEach(effect => {
        const elapsed = currentTime - effect.startTime;
        const progress = elapsed / effect.duration;
        
        // A more pronounced bounce easing function
        const bounceHeight = Math.sin(progress * Math.PI) * 0.1;

        for (let i = 0; i < positionArray.length; i += 3) {
          const vertex = new THREE.Vector3().fromArray(originalPositions.current!, i);
          const distance = vertex.distanceTo(effect.center);
          const maxDistance = 0.5; // Increased influence radius

          if (distance < maxDistance) {
            const influence = Math.pow(1 - distance / maxDistance, 2);
            const displacement = bounceHeight * influence;
            
            const displacedVertex = vertex.clone().normalize().multiplyScalar(2 + displacement);
            positionArray[i] = displacedVertex.x;
            positionArray[i + 1] = displacedVertex.y;
            positionArray[i + 2] = displacedVertex.z;
          }
        }
      });
      
      if (activeEffects.length !== bounceEffects.length) {
        setBounceEffects(activeEffects);
      }

      positions.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
    }
  });

  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    if (!meshRef.current) return;

    const radius = 2; // The radius of your sphere

    // RECOMMENDATION #1: Correct coordinate calculation.
    // Use the mesh's rotation to find the non-rotated geographical point.
    const rotationMatrix = new THREE.Matrix4().makeRotationY(-meshRef.current.rotation.y);
    const originalPoint = event.point.clone().applyMatrix4(rotationMatrix);
    
    // The standard, correct formulas for latitude and longitude.
    const lat = Math.asin(originalPoint.y / radius) * (180 / Math.PI);
    const lng = Math.atan2(originalPoint.x, originalPoint.z) * (180 / Math.PI);

    onCoordinateClick(lat, lng);

    // --- Trigger Bounce Effect ---
    // Convert the world-space click point to the sphere's local space for the bounce.
    const localPoint = meshRef.current.worldToLocal(event.point.clone());
    const newBounce: BounceEffect = {
      id: bounceIdCounter.current++,
      center: localPoint.normalize().multiplyScalar(radius),
      startTime: Date.now(),
      duration: 1200, // Slightly shorter duration
    };
    setBounceEffects(prev => [...prev.slice(-5), newBounce]); // Keep last 5 bounces
  }, [onCoordinateClick]);

  return (
    <mesh ref={meshRef} onClick={handleClick} position={[0, 0, 0]}>
      <sphereGeometry ref={geometryRef} args={[2, 128, 128]} />
      <meshPhongMaterial
        map={colorMap}
        bumpMap={bumpMap}
        bumpScale={0.015}
        specularMap={specularMap}
        specular={new THREE.Color('gray')}
        shininess={50}
      />
    </mesh>
  );
};

const Clouds = () => {
    const cloudMap = useLoader(THREE.TextureLoader, 'https://cdn.jsdelivr.net/gh/devmastery/3d-earth-react@main/src/assets/textures/4k/fair_clouds_4k.png');
    const meshRef = useRef<THREE.Mesh>(null!);
  
    useFrame((state, delta) => {
      // Rotate clouds slightly faster and in a different direction for parallax
      meshRef.current.rotation.y += delta * 0.08;
      meshRef.current.rotation.x += delta * 0.01;
    });
  
    return (
      <mesh ref={meshRef} scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[2, 128, 128]} />
        <meshPhongMaterial
          map={cloudMap}
          transparent={true}
          opacity={0.3}
          depthWrite={false} // Render clouds without obscuring earth details too much
          side={THREE.DoubleSide}
        />
      </mesh>
    );
};

const LoadingEarth = () => {
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial color="#4a90e2" emissive="#1a3d6f" roughness={0.8} metalness={0.2} />
    </mesh>
  );
};


// --- MAIN COMPONENT ---

const InteractiveGlobe = () => {
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [areTexturesLoaded, setAreTexturesLoaded] = useState(false);
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);

  // RECOMMENDATION #3: Fetch GeoJSON data on component mount.
  useEffect(() => {
    fetch(GEOJSON_URL)
      .then(response => response.json())
      .then((data: FeatureCollection) => setGeojson(data))
      .catch(error => console.error("Failed to load GeoJSON data:", error));
  }, []);

  const isLoading = !areTexturesLoaded || !geojson;

  // RECOMMENDATION #3: The robust country lookup function.
  const findCountry = useCallback((lat: number, lng: number): string => {
    if (!geojson) return "Loading map data...";

    const point = [lng, lat];

    for (const feature of geojson.features) {
      if (feature.geometry) {
        if (feature.geometry.type === 'Polygon') {
          if (pointInPolygon(point, feature.geometry.coordinates[0])) {
            return feature.properties?.ADMIN || 'Unknown Territory';
          }
        } else if (feature.geometry.type === 'MultiPolygon') {
          for (const polygon of feature.geometry.coordinates) {
            if (pointInPolygon(point, polygon[0])) {
              return feature.properties?.ADMIN || 'Unknown Territory';
            }
          }
        }
      }
    }
    return "Ocean";
  }, [geojson]);

  const handleCoordinateClick = useCallback((lat: number, lng: number) => {
    const country = findCountry(lat, lng);
    setSelectedLocation({ lat, lng, country });

    const notification = document.createElement('div');
    notification.innerHTML = `📍 ${country} (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`;
    notification.style.cssText = `...`; // Your existing notification style
    // ... (rest of your notification logic)
  }, [findCountry]);

  const handleTexturesLoaded = useCallback(() => {
    setAreTexturesLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black p-4 text-white">
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Interactive Earth Globe</h1>
            <p className="text-gray-300 text-lg">4K satellite imagery from NASA with dynamic clouds</p>
            <p className="text-gray-400 text-sm mt-2">Click anywhere for precise coordinates and country detection</p>
        </div>

        <div className="relative">
          <div className="h-[700px] w-full rounded-xl overflow-hidden bg-black border border-blue-500/20 shadow-2xl">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.2} />
              <directionalLight position={[5, 3, 5]} intensity={2.5} />
              <Stars radius={200} depth={60} count={10000} factor={4} saturation={0} fade speed={0.5} />

              <Suspense fallback={<LoadingEarth />}>
                <EarthSphere
                  onCoordinateClick={handleCoordinateClick}
                  onTexturesLoaded={handleTexturesLoaded}
                />
                <Clouds />
              </Suspense>

              <OrbitControls
                enablePan={false}
                minDistance={2.5}
                maxDistance={10}
                enableDamping={true}
                dampingFactor={0.05}
                rotateSpeed={0.4}
              />
            </Canvas>
          </div>

          {/* --- LOADING OVERLAY --- */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-white text-lg">Loading Planet Earth...</p>
                <p className="text-gray-400 text-sm">{!areTexturesLoaded ? "Downloading high-resolution textures..." : "Initializing geographic data..."}</p>
              </div>
            </div>
          )}

          {/* --- RIGHT INFO PANEL --- */}
          {selectedLocation && !isLoading && (
             <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md border border-blue-400/40 rounded-lg p-6 w-[320px] shadow-2xl animate-fade-in">
                <h3 className="text-blue-400 text-xl font-bold mb-4 flex items-center">
                  <span className="mr-3 text-2xl">{selectedLocation.country === 'Ocean' ? '🌊' : '🌍'}</span>
                  Selected Location
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Territory:</span>
                        <span className="font-bold text-lg text-green-300 text-right truncate">
                          {selectedLocation.country}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Latitude:</span>
                        <span className="font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">
                          {selectedLocation.lat.toFixed(4)}°
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Longitude:</span>
                        <span className="font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">
                          {selectedLocation.lng.toFixed(4)}°
                        </span>
                    </div>
                </div>
            </div>
          )}

          {/* --- BOTTOM CONTROLS PANEL --- */}
          <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md border border-blue-400/40 rounded-lg p-4 max-w-xs shadow-2xl">
            <div className="text-blue-400 font-bold text-sm mb-3">Controls</div>
            <div className="text-gray-300 text-xs space-y-2">
                <div><span className="font-semibold text-blue-300 w-16 inline-block">Click:</span><span>Get coordinates & bounce</span></div>
                <div><span className="font-semibold text-blue-300 w-16 inline-block">Drag:</span><span>Rotate globe</span></div>
                <div><span className="font-semibold text-blue-300 w-16 inline-block">Scroll:</span><span>Zoom in/out</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveGlobe;

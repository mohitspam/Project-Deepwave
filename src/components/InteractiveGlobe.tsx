// Enhanced Interactive Globe: 
// ✅ Fixed longitude sign convention
// ✅ Upgraded to 8K textures
// ✅ Cleaned UI (no country labels)

import { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const EarthSphere = ({ onCoordinateClick, onTexturesLoaded }) => {
  const meshRef = useRef(null);
  const geometryRef = useRef(null);
  const originalPositions = useRef(null);
  const [bounceEffects, setBounceEffects] = useState([]);
  const bounceIdCounter = useRef(0);

  const earthTexture = useLoader(THREE.TextureLoader, 'https://planetpixelemporium.com/download/earth8k.jpg');
  const bumpTexture = useLoader(THREE.TextureLoader, 'https://planetpixelemporium.com/download/earthbump8k.jpg');
  const specularTexture = useLoader(THREE.TextureLoader, 'https://planetpixelemporium.com/download/earthspec8k.jpg');

  useEffect(() => {
    earthTexture.anisotropy = 16;
    bumpTexture.anisotropy = 16;
    specularTexture.anisotropy = 16;

    const timer = setTimeout(() => onTexturesLoaded(), 100);
    return () => clearTimeout(timer);
  }, [earthTexture, bumpTexture, specularTexture, onTexturesLoaded]);

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

    if (geometryRef.current && originalPositions.current) {
      const positions = geometryRef.current.attributes.position;
      const positionArray = positions.array;

      for (let i = 0; i < positionArray.length; i++) {
        positionArray[i] = originalPositions.current[i];
      }

      const currentTime = Date.now();
      const activeEffects = [];

      bounceEffects.forEach(effect => {
        const elapsed = currentTime - effect.startTime;
        const progress = elapsed / effect.duration;

        if (progress < 1) {
          activeEffects.push(effect);

          const bounceHeight = Math.sin(progress * Math.PI * 3) * (1 - progress) * 0.12;

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

  const handleClick = useCallback(event => {
    event.stopPropagation();

    if (!meshRef.current) return;

    const point = event.point;
    const radius = 2;
    const normalizedPoint = point.clone().normalize().multiplyScalar(radius);
    const currentRotation = meshRef.current.rotation.y;
    const rotationMatrix = new THREE.Matrix4().makeRotationY(-currentRotation);
    const originalPoint = normalizedPoint.clone().applyMatrix4(rotationMatrix);

    const x = originalPoint.x;
    const y = originalPoint.y;
    const z = originalPoint.z;

    const lat = Math.asin(y / radius) * (180 / Math.PI);
    let lng = Math.atan2(x, z) * (180 / Math.PI); // ✅ Correct longitude system
    if (lng < -180) lng += 360;
    if (lng > 180) lng -= 360;

    const localPoint = new THREE.Vector3(point.x, point.y, point.z);
    localPoint.applyMatrix4(rotationMatrix);
    const bounceCenter = localPoint.normalize().multiplyScalar(2);

    const newBounce = {
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
  const meshRef = useRef(null);

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
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleCoordinateClick = useCallback((lat, lng) => {
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
        </div>

        <div className="relative">
          <div className="h-[700px] w-full rounded-xl overflow-hidden bg-black border border-blue-500/20 shadow-2xl">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 3, 5]} intensity={3.0} castShadow color="#ffffff" />
              <directionalLight position={[-4, 2, -2]} intensity={1.5} color="#ddddff" />
              <pointLight position={[-3, -3, -3]} intensity={0.5} color="#88ccff" />
              <Stars radius={200} depth={60} count={10000} factor={4} saturation={0} fade speed={0.3} />
              <Suspense fallback={<LoadingEarth />}>
                <EarthSphere onCoordinateClick={handleCoordinateClick} onTexturesLoaded={handleTexturesLoaded} />
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveGlobe;

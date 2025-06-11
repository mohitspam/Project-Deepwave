import { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
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

  useEffect(() => {
    const timer = setTimeout(() => {
      onTexturesLoaded();
    }, 100);
    return () => clearTimeout(timer);
  }, [earthTexture, bumpTexture, specularTexture, onTexturesLoaded]);

  useEffect(() => {
    if (geometryRef.current && !originalPositions.current) {
      const positions = geometryRef.current.attributes.position;
      originalPositions.current = new Float32Array(positions.array);
    }
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }

    if (geometryRef.current && originalPositions.current) {
      const positions = geometryRef.current.attributes.position;
      const positionArray = positions.array as Float32Array;

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

          const bounceHeight = Math.sin(progress * Math.PI * 3) * (1 - progress) * 0.12;

          for (let i = 0; i < positionArray.length; i += 3) {
            const vertex = new THREE.Vector3(
              originalPositions.current![i],
              originalPositions.current![i + 1],
              originalPositions.current![i + 2]
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
      geometryRef.current.computeVertexNormals();
    }
  });

  const handleClick = useCallback((event: any) => {
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
    let lng = Math.atan2(x, z) * (180 / Math.PI);
    if (lng < -180) lng += 360;
    if (lng > 180) lng -= 360;

    const localPoint = new THREE.Vector3(point.x, point.y, point.z);
    localPoint.applyMatrix4(rotationMatrix);
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

export default EarthSphere;

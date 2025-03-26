import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface CelestialBodyProps {
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  texturePath: string;
  orbitRadius?: number;
  orbitSpeed?: number;
  rotationSpeed?: number;
  isSun?: boolean;
}

const CelestialBody = ({
  position,
  rotation,
  scale,
  texturePath,
  orbitRadius = 0,
  orbitSpeed = 0,
  rotationSpeed = 0,
  isSun = false,
}: CelestialBodyProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(texturePath);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Handle rotation
    meshRef.current.rotation.y += rotationSpeed * delta;

    // Handle orbit
    if (orbitRadius > 0) {
      const angle = state.clock.elapsedTime * orbitSpeed;
      meshRef.current.position.x = Math.cos(angle) * orbitRadius;
      meshRef.current.position.z = Math.sin(angle) * orbitRadius;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      castShadow={!isSun}
      receiveShadow={!isSun}
    >
      <sphereGeometry args={[scale, 128, 128]} />
      <meshStandardMaterial
        map={texture}
        emissive={isSun ? new THREE.Color(0xffff80) : undefined}
        emissiveIntensity={isSun ? 1.5 : 0}
      />
      {isSun && (
        <>
          <pointLight
            intensity={3}
            distance={0}
            decay={0}
            color="white"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <ambientLight intensity={0.2} color="gray" />
        </>
      )}
    </mesh>
  );
};

export default CelestialBody;

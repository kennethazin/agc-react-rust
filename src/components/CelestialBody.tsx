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
  hasGravity?: boolean;
  gravityRadius?: number;
  gravityStrength?: number;
}

const CelestialBody = ({
  name,
  position,
  rotation,
  scale,
  texturePath,
  orbitRadius = 0,
  orbitSpeed = 0,
  rotationSpeed = 0,
  isSun = false,
  hasGravity = false,
  gravityRadius = 5,
  gravityStrength = 0.1,
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

    // Apply gravitational influence to nearby objects
    if (hasGravity && window.solarSystem) {
      for (const objName in window.solarSystem) {
        const obj = window.solarSystem[objName];
        if (obj.name !== name && obj.type === "spacecraft") {
          const targetPos = new THREE.Vector3().copy(obj.mesh.position);
          const bodyPos = new THREE.Vector3().copy(meshRef.current.position);
          const distance = bodyPos.distanceTo(targetPos);

          // Apply gravity if within gravity radius
          if (distance < gravityRadius) {
            const force = calculateGravityForce(distance, gravityStrength);
            const direction = new THREE.Vector3()
              .subVectors(bodyPos, targetPos)
              .normalize();

            // Apply gravitational pull
            obj.mesh.position.x += direction.x * force * delta;
            obj.mesh.position.y += direction.y * force * delta;
            obj.mesh.position.z += direction.z * force * delta;
          }
        }
      }
    }
  });

  // Calculate gravity force based on distance (inverse square law)
  const calculateGravityForce = (
    distance: number,
    strength: number
  ): number => {
    // Prevent division by zero and extreme forces when very close
    const safeDistance = Math.max(distance, 0.1);
    return strength / (safeDistance * safeDistance);
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      castShadow={!isSun}
      receiveShadow={!isSun}
      name={name}
    >
      <sphereGeometry args={[scale, 1024, 1024]} />
      <meshStandardMaterial
        map={texture}
        emissive={isSun ? new THREE.Color(0xffff80) : undefined}
        emissiveIntensity={isSun ? 0.8 : 0.5}
      />
      {isSun && (
        <>
          <pointLight
            intensity={0.8}
            distance={0}
            decay={0}
            color="white"
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
          />
          <ambientLight intensity={0.2} color="white" />
        </>
      )}
    </mesh>
  );
};

export default CelestialBody;

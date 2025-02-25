"use client";
import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Model } from "@/components/moon";
import { Telemetry } from "@/components/Telemetry";
import { Sun } from "@/components/Sun";
import { Earth } from "@/components/Earth";

function CameraCollision({ moonRef }) {
  const { camera } = useThree();

  useFrame(() => {
    if (moonRef.current) {
      const moonPosition = moonRef.current.position;
      const cameraPosition = camera.position;
      const distance = moonPosition.distanceTo(cameraPosition);
      const minDistance = 1.5; // Minimum distance from the moon's surface

      if (distance < minDistance) {
        const direction = cameraPosition.clone().sub(moonPosition).normalize();
        camera.position.copy(
          moonPosition.clone().add(direction.multiplyScalar(minDistance))
        );
      }
    }
  });

  return null;
}

export default function App() {
  const moonRef = useRef(null);

  return (
    <>
      <Canvas
        className="bg-black"
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 3] }}
      >
        <Stars
          radius={100}
          depth={200}
          count={10000}
          factor={10}
          saturation={1}
          fade
          speed={1}
        />
        <OrbitControls
          autoRotate
          rotateSpeed={0.5}
          zoomSpeed={1}
          autoRotateSpeed={0.1}
        />
        <Suspense fallback={null}>
          <Model ref={moonRef} />
          <Earth position={[100, 20, 300]} />
          <Telemetry moonRef={moonRef} />
          <CameraCollision moonRef={moonRef} />
          <Sun position={[-80, 400, 800]} />
        </Suspense>
        <mesh />
      </Canvas>
    </>
  );
}

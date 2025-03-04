"use client";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Model } from "@/components/moon";
import { Telemetry } from "@/components/Telemetry";
import { Sun } from "@/components/Sun";
import { Earth } from "@/components/Earth";
import { Lander } from "@/components/Lander";
import * as THREE from "three";
import { ORBIT_SPEED } from "@/utils/constants";
// import { DSKY } from "@/components/DSKY";

function CameraFollow({ moonRef, landerRef }) {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    if (moonRef.current && landerRef.current) {
      const elapsedTime = clock.getElapsedTime();
      const radius = 4;
      const speed = ORBIT_SPEED;
      const landerPosition = landerRef.current.position;

      camera.position.x =
        moonRef.current.position.x + radius * Math.cos(speed * elapsedTime);
      camera.position.z =
        moonRef.current.position.z + radius * Math.sin(speed * elapsedTime);
      camera.position.y = landerPosition.y + -0.4; // Adjust height as needed

      camera.lookAt(landerPosition);
    }
  });

  return null;
}

function LanderOrbit({ moonRef, landerRef, radius }) {
  useFrame(({ clock }) => {
    if (moonRef.current && landerRef.current) {
      const elapsedTime = clock.getElapsedTime();
      const speed = ORBIT_SPEED;
      landerRef.current.position.x =
        moonRef.current.position.x + radius * Math.cos(speed * elapsedTime);
      landerRef.current.position.z =
        moonRef.current.position.z + radius * Math.sin(speed * elapsedTime);
    }
  });

  return null;
}

export default function App() {
  const moonRef = useRef(null);
  const landerRef = useRef(null);
  const agc = useRef(null); // Assuming agc is initialised elsewhere
  const [landerOrbitRadius, setLanderOrbitRadius] = useState(3);

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas
          className="bg-black "
          camera={{ fov: 15, near: 0.001, far: 1000 }}
        >
          <Stars
            radius={100}
            depth={200}
            count={100000}
            factor={10}
            saturation={1}
            fade
            speed={1}
          />
          <OrbitControls />
          <Suspense fallback={null}>
            <Model ref={moonRef} />
            <Earth position={[100, 20, 300]} />
            <Telemetry
              moonRef={moonRef}
              setLanderOrbitRadius={setLanderOrbitRadius}
            />
            <CameraFollow moonRef={moonRef} landerRef={landerRef} />
            <LanderOrbit
              moonRef={moonRef}
              landerRef={landerRef}
              radius={landerOrbitRadius}
            />
            <Sun position={[-80, 400, 800]} />
            <Lander ref={landerRef} />
          </Suspense>
          <mesh />
        </Canvas>
        {/* <DSKY agc={agc.current} /> */}
      </div>
    </>
  );
}

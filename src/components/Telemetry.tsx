import React, { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";

export function Telemetry({ moonRef }) {
  const { camera } = useThree();
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const calculateDistance = () => {
      if (moonRef.current) {
        const moonPosition = moonRef.current.position;
        const cameraPosition = camera.position;
        const dist = moonPosition.distanceTo(cameraPosition);
        setDistance(dist - 1); // Subtracting the radius of the moon (1 unit)
      }
    };

    calculateDistance();
    const interval = setInterval(calculateDistance, 100);

    return () => clearInterval(interval);
  }, [camera, moonRef]);

  return (
    <>
      <Html className="text-white absolute top-0 left-0 p-4" fullscreen>
        Distance to Moon: {distance.toFixed(1)} units
      </Html>
    </>
  );
}

export default Telemetry;

import React, { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";

export function Telemetry({ moonRef, setLanderOrbitRadius }) {
  const { camera } = useThree();
  const [distance, setDistance] = useState(0);
  const [view, setView] = useState("Normal View");

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

  const handleViewChange = () => {
    const newView =
      view === "Normal View"
        ? "Wide View"
        : view === "Wide View"
        ? "Under View"
        : "Normal View";
    setView(newView);
    setLanderOrbitRadius(
      newView === "Normal View" ? 3 : newView === "Wide View" ? 2 : 5
    );
  };

  return (
    <>
      <Html
        className="text-white absolute top-0 left-0 p-4 flex flex-col items-start gap-2"
        fullscreen
      >
        <div className="bg-black text-white px-3 py-2 w-fit">
          Distance to Moon: {distance.toFixed(1)} units
        </div>
        <button
          onClick={handleViewChange}
          className="bg-black text-white px-3 py-2"
        >
          Change Orbit View (Current: {view})
        </button>
      </Html>
    </>
  );
}

export default Telemetry;

import React, { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export function Telemetry({ moonRef, setLanderOrbitRadius, landerRef }) {
  const { camera } = useThree();
  const [distance, setDistance] = useState(0);
  const [view, setView] = useState("Normal View");
  const [speed, setSpeed] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [descentRate, setDescentRate] = useState(0);
  const [thrustLevel, setThrustLevel] = useState(100); // Example value
  const [fuelRemaining, setFuelRemaining] = useState(100); // Example value
  const [imuReadings, setImuReadings] = useState({ pitch: 0, roll: 0, yaw: 0 });

  useEffect(() => {
    const calculateTelemetry = () => {
      if (moonRef.current && landerRef.current) {
        const moonPosition = moonRef.current.position;
        const landerPosition = landerRef.current.position;
        const dist = moonPosition.distanceTo(landerPosition);
        setAltitude(dist - 1); // Subtracting the radius of the moon (1 unit)

        // Calculate speed (example calculation)
        const velocity = new THREE.Vector3();
        landerRef.current.getWorldDirection(velocity);
        setSpeed(velocity.length());

        // Calculate descent rate (example calculation)
        setDescentRate(velocity.y);

        // Update IMU readings (example calculation)
        const rotation = landerRef.current.rotation;
        setImuReadings({
          pitch: rotation.x,
          roll: rotation.z,
          yaw: rotation.y,
        });
      }
    };

    calculateTelemetry();
    const interval = setInterval(calculateTelemetry, 100);

    return () => clearInterval(interval);
  }, [camera, moonRef, landerRef]);

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
        <div className="bg-black text-white px-3 py-2 w-fit">
          Speed: {speed.toFixed(2)} units/s
        </div>
        <div className="bg-black text-white px-3 py-2 w-fit">
          Altitude: {altitude.toFixed(2)} units
        </div>
        <div className="bg-black text-white px-3 py-2 w-fit">
          Descent Rate: {descentRate.toFixed(2)} units/s
        </div>
        <div className="bg-black text-white px-3 py-2 w-fit">
          Thrust Level: {thrustLevel}%
        </div>
        <div className="bg-black text-white px-3 py-2 w-fit">
          Fuel Remaining: {fuelRemaining}%
        </div>
        <div className="bg-black text-white px-3 py-2 w-fit">
          IMU Readings: Pitch: {imuReadings.pitch.toFixed(2)}, Roll:{" "}
          {imuReadings.roll.toFixed(2)}, Yaw: {imuReadings.yaw.toFixed(2)}
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

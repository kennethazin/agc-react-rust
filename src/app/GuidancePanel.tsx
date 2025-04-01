"use client";
import React, { useState, useEffect } from "react";
import DSKYStatusPanel from "./components/DSKYStatusPanel";

const GuidancePanel = () => {
  const [attitude, setAttitude] = useState({
    roll: 0,
    pitch: 0,
    yaw: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.solarSystem && window.solarSystem["Lunar Module"]) {
        const lunarModule = window.solarSystem["Lunar Module"];
        const rotation = lunarModule.mesh.rotation;

        setAttitude({
          roll: ((rotation.z * 180) / Math.PI) % 360,
          pitch: ((rotation.x * 180) / Math.PI) % 360,
          yaw: ((rotation.y * 180) / Math.PI) % 360,
        });
      } else {
        setAttitude((prev) => ({
          roll: (prev.roll + 1) % 360,
          pitch: 15 * Math.sin(Date.now() / 5000),
          yaw: (prev.yaw + 0.5) % 360,
        }));
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" text-black font-mono py-2 px-3 flex flex-col gap-5 text-center  ">
      <DSKYStatusPanel className="bg-gray-200 w-20 text-black  h-fit">
        Roll <br />
        {attitude.roll.toFixed(2)}
      </DSKYStatusPanel>
      <DSKYStatusPanel className="bg-gray-200 w-20 text-black  h-fit ">
        Pitch <br />
        {attitude.pitch.toFixed(2)}
      </DSKYStatusPanel>
      <DSKYStatusPanel className="bg-gray-200 w-20 text-black  h-full">
        Yaw <br />
        {attitude.yaw.toFixed(2)}
      </DSKYStatusPanel>
    </div>
  );
};

export default GuidancePanel;

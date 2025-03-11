"use client";
import React, { useState, useEffect } from "react";
import DSKYStatusPanel from "./components/DSKYStatusPanel";

const GuidancePanel = () => {
  const [attitude, setAttitude] = useState({
    roll: 0,
    pitch: 0,
    yaw: 0,
  });

  //simulating the attitude change
  useEffect(() => {
    const interval = setInterval(() => {
      setAttitude((prev) => ({
        roll: (prev.roll + 1) % 360,
        pitch: 15 * Math.sin(Date.now() / 5000),
        yaw: (prev.yaw + 0.5) % 360,
      }));
    }, 50);

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
        {attitude.roll.toFixed(2)}
      </DSKYStatusPanel>
    </div>
  );
};

export default GuidancePanel;

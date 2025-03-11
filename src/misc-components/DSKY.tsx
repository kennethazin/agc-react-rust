import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  init,
  sendCommand,
  getDisplayState,
  getAttitudeData,
} from "./agc-interface";

export default function DSKY() {
  const [initialized, setInitialized] = useState(false);
  const [displayData, setDisplayData] = useState({
    verb: "00",
    noun: "00",
    program: "00000",
    register1: "00000",
    register2: "000",
    compActy: false,
    uplinkActy: false,
    noAtt: false,
    gimbalLock: false,
    progLight: false,
    keyRel: false,
    oprErr: false,
    tempLight: false,
    stby: false,
    restart: false,
    tracker: false,
    alt: false,
    vel: false,
  });

  const [telemetry, setTelemetry] = useState({
    st: "00:00:00",
    met: "00:00:00",
    oga: "000.00",
    iga: "000.00",
    mga: "000.00",
    roll: "0.0",
    pitch: "0.0",
    yaw: "0.0",
  });

  const [verbInput, setVerbInput] = useState("");
  const [nounInput, setNounInput] = useState("");
  const [programInput, setProgramInput] = useState("");
  const attitudeRef = useRef<HTMLCanvasElement>(null);

  // Initialize WebAssembly module
  useEffect(() => {
    const initAGC = async () => {
      try {
        await init();
        setInitialized(true);
        // Start update loop
        const intervalId = setInterval(updateDisplays, 100);
        return () => clearInterval(intervalId);
      } catch (error) {
        console.error("Failed to initialize AGC:", error);
        // Show an error message to the user
        alert(
          "Failed to initialize Apollo Guidance Computer. Check console for details."
        );
      }
    };

    initAGC();
  }, []);

  // Update displays with data from the AGC emulation
  const updateDisplays = () => {
    if (!initialized) return;

    try {
      // Try to get display state
      const displayState = getDisplayState();
      setDisplayData(displayState);

      // Try to get attitude data
      try {
        const attitudeData = getAttitudeData();
        updateAttitudeIndicator(attitudeData);

        // Update telemetry based on AGC data
        setTelemetry((prev) => ({
          ...prev,
          roll: attitudeData.roll.toFixed(1),
          pitch: attitudeData.pitch.toFixed(1),
          yaw: attitudeData.yaw.toFixed(1),
        }));
      } catch (attitudeError) {
        console.error("Error updating attitude indicator:", attitudeError);
        // Continue with other updates even if attitude fails
      }
    } catch (error) {
      console.error("Error updating displays:", error);
    }
  };

  // Draw the attitude indicator
  const updateAttitudeIndicator = (data: {
    roll: number;
    pitch: number;
    yaw: number;
  }) => {
    const canvas = attitudeRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw tick marks
    for (let i = 0; i < 24; i++) {
      const angle = (i * 15 * Math.PI) / 180;
      const startRadius = radius - 5;
      const endRadius = radius;

      ctx.beginPath();
      ctx.moveTo(
        centerX + startRadius * Math.cos(angle),
        centerY + startRadius * Math.sin(angle)
      );
      ctx.lineTo(
        centerX + endRadius * Math.cos(angle),
        centerY + endRadius * Math.sin(angle)
      );
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Apply pitch rotation (tilt the horizon)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((data.roll * Math.PI) / 180);

    // Draw horizon (half black, half white)
    ctx.beginPath();
    ctx.arc(0, 0, radius - 10, 0, Math.PI, true);
    ctx.fillStyle = "#000000";
    ctx.fill();

    // Draw center reticle
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  };

  // Handle keypad input
  const handleKeyPress = (key: string) => {
    if (!initialized) return;

    try {
      sendCommand(key);
      // The display will be updated in the next update cycle
    } catch (error) {
      console.error("Error sending command:", error);
    }
  };

  // Handle special functions
  const handleLaunch = () => {
    if (!initialized) return;
    sendCommand("LAUNCH");
  };

  const handleEnableIMU = () => {
    if (!initialized) return;
    sendCommand("ENABLE_IMU");
  };

  const handleShutdown = () => {
    if (!initialized) return;
    sendCommand("SHUTDOWN");
  };

  // Render the DSKY interface
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-900 text-white  max-w-6xl mx-auto w-screen">
      {/* Left panel - DSKY */}
      <Card className="bg-gray-300 p-4 rounded-lg flex-1">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* Status lights - top row */}
          <div
            className={`p-2 text-center bg-gray-500 ${
              displayData.uplinkActy ? "bg-yellow-500" : ""
            }`}
          >
            UPLINK
            <br />
            ACTY
          </div>
          <div
            className={`p-2 text-center bg-gray-500 ${
              displayData.tempLight ? "bg-yellow-500" : ""
            }`}
          >
            TEMP
          </div>

          {/* Status lights - second row */}
          <div
            className={`p-2 text-center bg-gray-500 ${
              displayData.noAtt ? "bg-yellow-500" : ""
            }`}
          >
            NO ATT
          </div>
          <div
            className={`p-2 text-center bg-gray-500 ${
              displayData.gimbalLock ? "bg-yellow-500" : ""
            }`}
          >
            GIMBALL
            <br />
            LOCK
          </div>

          {/* Status lights - third row */}
          <div
            className={`p-2 text-center bg-gray-500 ${
              displayData.stby ? "bg-yellow-500" : ""
            }`}
          >
            STBY
          </div>
          <div
            className={`p-2 text-center ${
              displayData.progLight ? "bg-yellow-500" : "bg-gray-500"
            }`}
          >
            PROG
          </div>

          {/* Status lights - fourth row */}
          <div
            className={`p-2 text-center bg-gray-500 ${
              displayData.keyRel ? "bg-yellow-500" : ""
            }`}
          >
            KEY REL
          </div>
          <div
            className={`p-2 text-center bg-gray-500 ${
              displayData.restart ? "bg-yellow-500" : ""
            }`}
          >
            RESTART
          </div>

          {/* Status lights - fifth row */}
          <div
            className={`p-2 text-center bg-gray-500 ${
              displayData.oprErr ? "bg-yellow-500" : ""
            }`}
          >
            OPR ERR
          </div>
          <div
            className={`p-2 text-center bg-gray-500 ${
              displayData.tracker ? "bg-yellow-500" : ""
            }`}
          >
            TRACKER
          </div>

          {/* Status lights - sixth row */}
          <div className="p-2 text-center bg-gray-500"></div>
          <div
            className={`p-2 text-center bg-gray-500 ${
              displayData.alt ? "bg-yellow-500" : ""
            }`}
          >
            ALT
          </div>

          {/* Status lights - seventh row */}
          <div className="p-2 text-center bg-gray-500"></div>
          <div
            className={`p-2 text-center bg-gray-500 ${
              displayData.vel ? "bg-yellow-500" : ""
            }`}
          >
            VEL
          </div>
        </div>

        {/* Display panel */}
        <div className="bg-black p-4 mb-4 rounded">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div
              className={`p-2 text-center ${
                displayData.compActy ? "bg-green-500" : "bg-gray-600"
              }`}
            >
              COMP
              <br />
              ACTY
            </div>
            <div
              className={`p-2 text-center ${
                displayData.progLight ? "bg-green-500" : "bg-gray-600"
              }`}
            >
              PROG
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-2 text-center bg-green-500">VERB</div>
            <div className="p-2 text-center bg-green-500">NOUN</div>
          </div>

          <div className="flex justify-center mb-2">
            <div className="font-mono text-5xl text-green-500 bg-gray-700 px-2 w-full text-center">
              {displayData.verb}
            </div>
            <div className="font-mono text-5xl text-green-500 bg-gray-700 px-2 w-full text-center">
              {displayData.noun}
            </div>
          </div>

          <div className="font-mono text-5xl text-green-500 bg-gray-700 px-2 mb-2 text-center">
            {displayData.program}
          </div>

          <div className="font-mono text-5xl text-green-500 bg-gray-700 px-2 mb-2 text-center">
            {displayData.register1}
          </div>

          <div className="font-mono text-5xl text-green-500 bg-gray-700 px-2 text-center">
            {displayData.register2}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-7 gap-2">
          <div className="col-span-1">
            <Button
              className="w-full h-16 bg-gray-600 hover:bg-gray-700 text-white"
              onClick={() => handleKeyPress("VERB")}
            >
              VERB
            </Button>

            <Button
              className="w-full h-16 mt-2 bg-gray-600 hover:bg-gray-700 text-white"
              onClick={() => handleKeyPress("NOUN")}
            >
              NOUN
            </Button>
          </div>

          <div className="col-span-5 grid grid-cols-5 gap-2">
            <Button
              className="h-16 bg-gray-600 hover:bg-gray-700 text-white text-2xl"
              onClick={() => handleKeyPress("+")}
            >
              +
            </Button>
            <Button
              className="h-16 bg-gray-600 hover:bg-gray-700 text-white text-2xl"
              onClick={() => handleKeyPress("7")}
            >
              7
            </Button>
            <Button
              className="h-16 bg-gray-600 hover:bg-gray-700 text-white text-2xl"
              onClick={() => handleKeyPress("8")}
            >
              8
            </Button>
            <Button
              className="h-16 bg-gray-600 hover:bg-gray-700 text-white text-2xl"
              onClick={() => handleKeyPress("9")}
            >
              9
            </Button>
            <Button
              className="h-16 bg-gray-600 hover:bg-gray-700 text-white"
              onClick={() => handleKeyPress("CLR")}
            >
              CLR
            </Button>

            <Button
              className="h-16 bg-gray-600 hover:bg-gray-700 text-white text-2xl"
              onClick={() => handleKeyPress("-")}
            >
              -
            </Button>
            <Button
              className="h-16 bg-gray-600 hover:bg-gray-700 text-white text-2xl"
              onClick={() => handleKeyPress("4")}
            >
              4
            </Button>
            <Button
              className="h-16 bg-gray-600 hover:bg-gray-700 text-white text-2xl"
              onClick={() => handleKeyPress("5")}
            >
              5
            </Button>
            <Button
              className="h-16 bg-gray-600 hover:bg-gray-700 text-white text-2xl"
              onClick={() => handleKeyPress("6")}
            >
              6
            </Button>
            <Button
              className="h-16 bg-gray-600 hover:bg-gray-700 text-white"
              onClick={() => handleKeyPress("PRO")}
            >
              PRO
            </Button>

            <Button
              className="h-16 bg-gray-600 hover:bg-gray-700 text-white text-2xl"
              onClick={() => handleKeyPress("0")}
            >
              0
            </Button>
            <Button
              className="h-16 bg-gray-600 hover:bg-gray-700 text-white text-2xl"
              onClick={() => handleKeyPress("1")}
            >
              1
            </Button>
            <Button
              className="h-16 bg-gray-600 hover:bg-gray-700 text-white text-2xl"
              onClick={() => handleKeyPress("2")}
            >
              2
            </Button>
            <Button
              className="h-16 bg-gray-600 hover:bg-gray-700 text-white text-2xl"
              onClick={() => handleKeyPress("3")}
            >
              3
            </Button>
            <Button
              className="h-16 bg-gray-600 hover:bg-gray-700 text-white"
              onClick={() => handleKeyPress("KEY REL")}
            >
              KEY
              <br />
              REL
            </Button>
          </div>

          <div className="col-span-1">
            <Button
              className="w-full h-16 bg-gray-600 hover:bg-gray-700 text-white"
              onClick={() => handleKeyPress("ENTR")}
            >
              ENTR
            </Button>

            <Button
              className="w-full h-16 mt-2 bg-gray-600 hover:bg-gray-700 text-white"
              onClick={() => handleKeyPress("RSET")}
            >
              RSET
            </Button>
          </div>
        </div>
      </Card>

      {/* Right panel - Telemetry and Attitude */}
      <Card className="bg-gray-300 p-4 rounded-lg flex-1">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Telemetry displays */}
          <div className="col-span-2 grid grid-cols-2 gap-2">
            <div className="text-blue-600 font-bold text-right pr-2">ST</div>
            <div className="bg-gray-800 text-cyan-400 font-mono text-2xl px-2">
              {telemetry.st}
            </div>

            <div className="text-blue-600 font-bold text-right pr-2">MET</div>
            <div className="bg-gray-800 text-cyan-400 font-mono text-2xl px-2">
              {telemetry.met}
            </div>

            <div className="text-blue-600 font-bold text-right pr-2">OGA</div>
            <div className="bg-gray-800 text-cyan-400 font-mono text-2xl px-2">
              {telemetry.oga}
            </div>

            <div className="text-blue-600 font-bold text-right pr-2">IGA</div>
            <div className="bg-gray-800 text-cyan-400 font-mono text-2xl px-2">
              {telemetry.iga}
            </div>

            <div className="text-blue-600 font-bold text-right pr-2">MGA</div>
            <div className="bg-gray-800 text-cyan-400 font-mono text-2xl px-2">
              {telemetry.mga}
            </div>

            <div className="text-blue-600 font-bold text-right pr-2">ROLL</div>
            <div className="bg-gray-800 text-cyan-400 font-mono text-2xl px-2">
              {telemetry.roll}
            </div>

            <div className="text-blue-600 font-bold text-right pr-2">PITCH</div>
            <div className="bg-gray-800 text-cyan-400 font-mono text-2xl px-2">
              {telemetry.pitch}
            </div>

            <div className="text-blue-600 font-bold text-right pr-2">YAW</div>
            <div className="bg-gray-800 text-cyan-400 font-mono text-2xl px-2">
              {telemetry.yaw}
            </div>
          </div>

          {/* Control buttons */}
          <Button
            className="bg-white text-black hover:bg-gray-100"
            onClick={handleEnableIMU}
          >
            Enable IMU
          </Button>

          <div className="bg-gray-500 p-2 text-center">S-IC</div>

          <Button
            className="bg-white text-black hover:bg-gray-100"
            onClick={handleLaunch}
          >
            Launch
          </Button>

          <div className="bg-gray-500 p-2 text-center">S-II</div>

          <Button
            className="bg-white text-black hover:bg-gray-100"
            onClick={handleShutdown}
          >
            Shut down
          </Button>

          <div className="bg-gray-500 p-2 text-center">S-IVB</div>
        </div>

        {/* Attitude indicator */}
        <div className="mt-4">
          <canvas
            ref={attitudeRef}
            width={300}
            height={300}
            className="bg-gray-500 mx-auto rounded"
          />
        </div>
      </Card>
    </div>
  );
}

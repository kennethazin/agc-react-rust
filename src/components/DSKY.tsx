import React, { useState, useEffect } from "react";
import { Html } from "@react-three/drei";

export function DSKY({ agc }) {
  const [display, setDisplay] = useState({
    verb: "00",
    noun: "00",
    prog: "00",
    registers: ["+00000", "+00000", "+00000"],
  });

  useEffect(() => {
    const handleAGCResponse = (response) => {
      setDisplay(response);
    };

    agc.on("response", handleAGCResponse);

    return () => {
      agc.off("response", handleAGCResponse);
    };
  }, [agc]);

  const handleKeyPress = (key) => {
    agc.send(key);
  };

  return (
    <div className="dsky">
      <div className="display">
        <div className="prog">{display.prog}</div>
        <div className="verb">{display.verb}</div>
        <div className="noun">{display.noun}</div>
        <div className="registers">
          {display.registers.map((reg, index) => (
            <div key={index} className="register">
              {reg}
            </div>
          ))}
        </div>
      </div>
      <div className="keypad">
        {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "CLR", "ENT"].map(
          (key) => (
            <button key={key} onClick={() => handleKeyPress(key)}>
              {key}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default DSKY;

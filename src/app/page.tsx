"use client";
import React, { useState, useEffect } from "react";
import init, { AGC } from "wasm-lib";

function App() {
  const [agc, setAgc] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [gravity, setGravity] = useState(0);
  const [agcState, setAgcState] = useState("");

  // Initialize WASM module
  useEffect(() => {
    init().then(() => {
      setAgc(new AGC());
    });
  }, []);

  // Update AGC state
  const updateAGC = () => {
    if (agc) {
      agc.update(speed, gravity);
      setAgcState(agc.get_state());
    }
  };

  return (
    <div className="App">
      <h1>Apollo Guidance Computer (AGC) Emulator</h1>
      <div>
        <label>
          Speed:
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Gravity:
          <input
            type="number"
            value={gravity}
            onChange={(e) => setGravity(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <button onClick={updateAGC}>Update AGC</button>
      <pre>{agcState}</pre>
    </div>
  );
}

export default App;

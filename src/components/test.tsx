"use client";
import React, { useState, useEffect } from "react";
import init, { AGC } from "wasm-lib";

function Test() {
  const [agc, setAgc] = useState(null);
  const [altitude, setAltitude] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [fuel, setFuel] = useState(0);
  const [throttle, setThrottle] = useState(0);
  const [dskyDisplay, setDskyDisplay] = useState("Welcome");
  const [dskyInputRegister, setDskyInputRegister] = useState("");
  const [dskyInputValue, setDskyInputValue] = useState("");

  useEffect(() => {
    init().then(() => {
      setAgc(new AGC());
    });
  }, []);

  useEffect(() => {
    if (!agc) return;

    const interval = setInterval(() => {
      agc.update(0.1); // Update every 100ms (0.1 seconds)
      const state = JSON.parse(agc.get_state());
      setAltitude(state.altitude);
      setVelocity(state.velocity);
      setFuel(state.fuel);
      setDskyDisplay(state.dsky_display);
    }, 100);

    return () => clearInterval(interval);
  }, [agc]);

  const handleThrottleChange = (event) => {
    const newThrottle = parseFloat(event.target.value);
    setThrottle(newThrottle);
    if (agc) {
      agc.set_throttle(newThrottle);
    }
  };
  const handleDskyInput = () => {
    if (agc) {
      agc.dsky_input_set(dskyInputRegister, dskyInputValue);
    }
  };

  return (
    <div className="App">
      <h1>Apollo Guidance Computer (AGC) Emulator</h1>
      <div>Altitude: {altitude.toFixed(2)} meters</div>
      <div>Velocity: {velocity.toFixed(2)} m/s</div>
      <div>Fuel: {fuel.toFixed(2)}%</div>
      <div>
        <label>
          Throttle:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={throttle}
            onChange={handleThrottleChange}
          />
        </label>
      </div>
      <div>DSKY Display: {dskyDisplay}</div>
      <div>
        <label>
          Register:
          <input
            type="text"
            value={dskyInputRegister}
            onChange={(e) => setDskyInputRegister(e.target.value)}
          />
        </label>
        <label>
          Value:
          <input
            type="text"
            value={dskyInputValue}
            onChange={(e) => setDskyInputValue(e.target.value)}
          />
        </label>
        <button onClick={handleDskyInput}>Enter</button>
      </div>
    </div>
  );
}

export default Test;

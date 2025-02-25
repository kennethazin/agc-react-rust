use wasm_bindgen::prelude::*;
use std::collections::HashMap;

#[wasm_bindgen]
pub struct AGC {
    altitude: f64,
    velocity: f64,
    fuel: f64,
    gravity: f64,
    throttle: f64,
    dsky_display: String,
    dsky_input: HashMap<String, String>, // Store DSKY input
}

#[wasm_bindgen]
impl AGC {
    #[wasm_bindgen(constructor)]
    pub fn new() -> AGC {
        AGC {
            altitude: 10000.0, // Initial altitude (meters)
            velocity: -50.0,   // Initial descent velocity (meters/second)
            fuel: 100.0,      // Initial fuel (percentage)
            gravity: 1.62,     // Lunar gravity (m/s^2)
            throttle: 0.0,     // Initial throttle (0-1)
            dsky_display: "Welcome".to_string(),
            dsky_input: HashMap::new(),
        }
    }

    #[wasm_bindgen]
    pub fn update(&mut self, delta_time: f64) {
        // Simple descent simulation
        let acceleration = self.gravity - self.throttle * 5.0; // Simple thrust model
        self.velocity += acceleration * delta_time;
        self.altitude += self.velocity * delta_time;
        self.fuel -= self.throttle * 0.1 * delta_time; // Fuel consumption

        // Clamp values
        if self.altitude < 0.0 {
            self.altitude = 0.0;
            self.velocity = 0.0;
        }
        if self.fuel < 0.0 {
            self.fuel = 0.0;
            self.fuel = 0.0;
        }
    }

    #[wasm_bindgen]
    pub fn get_state(&self) -> String {
        format!(
            r#"{{"altitude": {:.2}, "velocity": {:.2}, "fuel": {:.2}, "dsky_display": "{}"}}"#,
            self.altitude, self.velocity, self.fuel, self.dsky_display
        )
    }
    #[wasm_bindgen]
    pub fn set_throttle(&mut self, throttle: f64) {
        self.throttle = throttle.clamp(0.0, 1.0);
    }
    #[wasm_bindgen]
    pub fn dsky_input_set(&mut self, register: String, value: String) {
        self.dsky_input.insert(register.clone(), value.clone());
        self.dsky_display = format!("{} : {}", register, value); //basic display
    }
    #[wasm_bindgen]
    pub fn dsky_input_get(&self, register: String) -> String {
        self.dsky_input.get(&register).cloned().unwrap_or_default()
    }
}
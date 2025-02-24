use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct AGC {
    speed: f64,
    gravity: f64,
}

#[wasm_bindgen]
impl AGC {
    #[wasm_bindgen(constructor)]
    pub fn new() -> AGC {
        AGC {
            speed: 0.0,
            gravity: 0.0,
        }
    }

    // Update AGC state with telemetry data
    #[wasm_bindgen]
    pub fn update(&mut self, speed: f64, gravity: f64) {
        self.speed = speed;
        self.gravity = gravity;
    }

    // Get AGC state as a JSON string
    #[wasm_bindgen]
    pub fn get_state(&self) -> String {
        format!(
            r#"{{ "speed": {}, "gravitas": {} }}"#,
            self.speed, self.gravity
        )
    }
}
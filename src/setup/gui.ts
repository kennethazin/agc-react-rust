import * as dat from "lil-gui";
import { SolarSystem } from "./solar-system";

import * as THREE from "three";
export const options = {
  showPaths: false,
  showMoons: true,
  focus: "Lunar Module",
  clock: true,
  speed: 0.001,
  zangle: 0,
  yangle: 0,
};

export const createGUI = (
  ambientLight: THREE.AmbientLight,
  solarSystem: SolarSystem,
  clock: THREE.Clock
) => {
  const gui = new dat.GUI();

  gui.title("Simulation Controls");

  gui.add(ambientLight, "intensity", 0, 0.8, 0.05).name("Ambient Intensity");

  // Pause the simulation
  gui
    .add(options, "clock")
    .name("Run")
    .onChange((value: boolean) => {
      if (value) {
        clock.start();
      } else {
        clock.stop();
      }
    });

  // Control the simulation speed
  gui.add(options, "speed", 0.001, 20, 0.1).name("Speed");

  gui.hide();

  // Toggle ambient lights
  document.getElementById("btn-ambient")?.addEventListener("click", () => {
    ambientLight.intensity = ambientLight.intensity <= 0.3 ? 0.8 : 0.3;
  });

  // Toggle paths
  document.getElementById("btn-paths")?.addEventListener("click", () => {
    options.showPaths = !options.showPaths;

    for (const name in solarSystem) {
      const object = solarSystem[name];
      if (object.path) {
        object.path.visible = options.showPaths;
      }
    }
  });

  // Toggle GUI panel
  document.getElementById("btn-settings")?.addEventListener("click", () => {
    gui.show(gui._hidden);
  });
};

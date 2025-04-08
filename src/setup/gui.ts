import * as THREE from "three";
import { SolarSystem } from "./solar-system";
import GUI from "lil-gui";

export const options = {
  speed: 0.01,
  showPaths: false,
  showGravityFields: false,
  ambientLight: 0.25,
};

// Make options globally accessible
window.options = options;

export const createGUI = (
  ambientLight: THREE.AmbientLight,
  solarSystem: SolarSystem,
  clock: THREE.Clock
) => {
  const gui = new GUI();
  gui.close();

  const timeFolder = gui.addFolder("Time");
  timeFolder.add(options, "speed", 0, 1, 0.01).name("Speed");
  timeFolder
    .add(
      {
        reset: () => {
          clock.start();
        },
      },
      "reset"
    )
    .name("Reset Clock");

  const visualsFolder = gui.addFolder("Visuals");
  visualsFolder
    .add(options, "showPaths")
    .name("Show Paths")
    .onChange((value: boolean) => {
      for (const object of Object.values(solarSystem)) {
        if (object.path) {
          object.path.visible = value;
        }
      }
    });

  visualsFolder
    .add(options, "showGravityFields")
    .name("Show Gravity Fields")
    .onChange((value: boolean) => {
      for (const object of Object.values(solarSystem)) {
        if (object.hasGravity) {
          object.toggleGravityVisual(value);
        }
      }
    });

  visualsFolder
    .add(options, "ambientLight", 0, 1, 0.01)
    .name("Ambient Light")
    .onChange((value: number) => {
      ambientLight.intensity = value;
    });

  // Add button handlers

  options.ambientLight = options.ambientLight > 0.5 ? 0.25 : 1;
  ambientLight.intensity = options.ambientLight;
  for (const controller of visualsFolder.controllers) {
    controller.updateDisplay();
  }

  options.showPaths = !options.showPaths;
  options.showGravityFields = !options.showGravityFields;

  for (const object of Object.values(solarSystem)) {
    if (object.path) {
      object.path.visible = options.showPaths;
    }
    if (object.hasGravity) {
      object.toggleGravityVisual(options.showGravityFields);
    }
  }

  for (const controller of visualsFolder.controllers) {
    controller.updateDisplay();
  }

  gui.open();

  return gui;
};

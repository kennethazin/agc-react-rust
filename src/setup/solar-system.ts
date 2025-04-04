import { PlanetaryObject } from "./planetary-object";
import planetData from "../planets.json";
import { Body } from "./planetary-object";
import * as THREE from "three";

// Add type declaration to Window interface
declare global {
  interface Window {
    solarSystem?: Record<string, PlanetaryObject>;
  }
}

export type SolarSystem = Record<string, PlanetaryObject>;

export const createSolarSystem = (
  scene: THREE.Scene
): [SolarSystem, string[]] => {
  const solarSystem: SolarSystem = {};

  const planets: Body[] = planetData;
  const traversable: string[] = [];

  for (const planet of planets) {
    const name = planet.name;

    if (planet.period === 0 && planet.orbits) {
      planet.period = planet.daylength / solarSystem[planet.orbits].daylength;
    }

    const object = new PlanetaryObject(planet);

    solarSystem[name] = object;

    if (object.orbits) {
      const parentMesh = solarSystem[object.orbits].mesh;
      parentMesh.add(object.mesh);
      if (object.path) {
        parentMesh.add(object.path);
      }
    }

    if (planet.traversable) {
      traversable.push(planet.name);
    }
  }

  scene.add(solarSystem["Sun"].mesh);

  // Make solar system accessible globally
  window.solarSystem = solarSystem;

  return [solarSystem, traversable];
};

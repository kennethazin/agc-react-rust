import { PlanetaryObject } from "./planetary-object";
import planetData from "../planets.json";
import { Body } from "./planetary-object";
import * as THREE from "three";

declare global {
  interface Window {
    solarSystem?: Record<string, PlanetaryObject>;
    options?: {
      speed: number;
      showPaths: boolean;
      showGravityFields: boolean;
      ambientLight: number;
    };
  }
}

export type SolarSystem = Record<string, PlanetaryObject>;

export const createSolarSystem = (
  scene: THREE.Scene
): [SolarSystem, string[]] => {
  const solarSystem: SolarSystem = {};

  const planets: Body[] = planetData;
  const traversable: string[] = [];

  // First pass: Create all objects
  for (const planet of planets) {
    const name = planet.name;
    const object = new PlanetaryObject(planet);
    solarSystem[name] = object;

    // Calculate Moon's period relative to Earth if needed (example)
    if (name === "Moon" && object.orbits === "Earth" && object.period === 0) {
      // Approximate based on day length - replace with actual orbital period if known
      // object.period = 27.3; // Example: Actual sidereal period in days
      // Or keep it simple if daylength ratio is sufficient for visual orbit
      object.period = Math.abs(
        object.daylength / solarSystem[object.orbits].daylength
      );
    }

    if (planet.traversable) {
      traversable.push(planet.name);
    }
  }

  // Second pass: Set up hierarchy and initial physics states
  for (const name in solarSystem) {
    const object = solarSystem[name];

    if (object.orbits) {
      const parentObject = solarSystem[object.orbits];
      if (parentObject) {
        // Calculate initial position based on distance and offset angle
        const initialAngle = object.rng; // Use the random offset or defined offset
        object.mesh.position.x = Math.sin(initialAngle) * object.distance;
        object.mesh.position.z = Math.cos(initialAngle) * object.distance;
        // Add mesh to parent
        parentObject.mesh.add(object.mesh);
        if (object.path) {
          parentObject.mesh.add(object.path);
        }
      }
    } else {
      // Add top-level objects (like the Sun) directly to the scene
      scene.add(object.mesh);
    }

    // --- Set Initial Velocity for Lunar Module ---
    if (object.name === "Lunar Module" && object.isPhysicsObject) {
      const targetObject = solarSystem["Moon"];
      if (targetObject) {
        // Get initial world positions (important after hierarchy is set)
        const lmWorldPos = new THREE.Vector3();
        object.mesh.getWorldPosition(lmWorldPos);

        const moonWorldPos = new THREE.Vector3();
        targetObject.mesh.getWorldPosition(moonWorldPos);

        // Calculate direction vector from LM to Moon in world space
        const direction = new THREE.Vector3()
          .subVectors(moonWorldPos, lmWorldPos)
          .normalize();

        // Set initial velocity (adjust speed multiplier as needed)
        const initialSpeed = 0.001; // Reduced initial speed significantly
        object.velocity.copy(direction.multiplyScalar(initialSpeed));

        // Optional: Give it some initial tangential velocity if starting in Earth orbit
        // To simulate being in orbit around Earth initially, add velocity perpendicular to Earth
        const earthObject = solarSystem["Earth"];
        if (earthObject) {
          const earthWorldPos = new THREE.Vector3();
          earthObject.mesh.getWorldPosition(earthWorldPos);
          const vectorToEarth = new THREE.Vector3().subVectors(
            lmWorldPos,
            earthWorldPos
          );
          // Simple tangential velocity in XZ plane (assuming Earth is at origin of its local space)
          const tangent = new THREE.Vector3(
            -vectorToEarth.z,
            0,
            vectorToEarth.x
          ).normalize();
          const orbitalSpeed = 0.002; // Adjust this value for stable-ish orbit start
          object.velocity.add(tangent.multiplyScalar(orbitalSpeed)); // Add orbital velocity component
        }
      }
    }
    // --- End Initial Velocity Setup ---
  }

  // Make solar system accessible globally
  window.solarSystem = solarSystem;

  return [solarSystem, traversable];
};

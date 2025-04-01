import * as THREE from "three";
import { createPath } from "./path";
import { loadTexture } from "./textures";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export interface Body {
  name: string;
  radius: number;
  distance: number;
  period: number;
  daylength: number;
  textures: TexturePaths;
  type: string;
  tilt: number;
  orbits?: string;
  traversable: boolean;
  offset?: number;
  model?: string;
  scale?: number;
}

interface TexturePaths {
  map: string;
  bump?: string;
  atmosphere?: string;
  atmosphereAlpha?: string;
  specular?: string;
}

interface Atmosphere {
  map?: THREE.Texture;
  alpha?: THREE.Texture;
}

const timeFactor = 8 * Math.PI * 2; // 1s real-time => 8h simulation time

const normaliseRadius = (radius: number): number => {
  return Math.sqrt(radius) / 500;
};

const normaliseDistance = (distance: number): number => {
  return Math.pow(distance, 0.4);
};

const degreesToRadians = (degrees: number): number => {
  return (Math.PI * degrees) / 180;
};

export class PlanetaryObject {
  radius: number; // in km
  distance: number; // in million km
  period: number; // in days
  daylength: number; // in hours
  orbits?: string;
  type: string;
  tilt: number; // degrees
  mesh: THREE.Mesh | THREE.Group;
  path?: THREE.Line;
  rng: number;
  map: THREE.Texture;
  bumpMap?: THREE.Texture;
  specularMap?: THREE.Texture;
  atmosphere: Atmosphere = {};
  modelPath?: string;
  modelScale?: number;

  constructor(body: Body) {
    const {
      radius,
      distance,
      period,
      daylength,
      orbits,
      type,
      tilt,
      model,
      scale,
    } = body;

    this.radius = normaliseRadius(radius);
    this.distance = normaliseDistance(distance);
    this.period = period;
    this.daylength = daylength;
    this.orbits = orbits;
    this.type = type;
    this.tilt = degreesToRadians(tilt);
    this.rng = body.offset ?? Math.random() * 2 * Math.PI;
    this.modelPath = model;
    this.modelScale = scale;

    this.loadTextures(body.textures);

    if (this.modelPath) {
      // Create a temporary mesh as a placeholder while the model loads
      this.mesh = new THREE.Group();
      this.loadModel();
    } else {
      this.mesh = this.createMesh();
    }

    if (this.orbits) {
      this.path = createPath(this.distance);
    }

    if (this.atmosphere.map && !this.modelPath) {
      this.mesh.add(this.createAtmosphereMesh());
    }
  }

  private loadTextures(textures: TexturePaths) {
    this.map = loadTexture(textures.map);
    if (textures.bump) {
      this.bumpMap = loadTexture(textures.bump);
    }
    if (textures.specular) {
      this.specularMap = loadTexture(textures.specular);
    }
    if (textures.atmosphere) {
      this.atmosphere.map = loadTexture(textures.atmosphere);
    }
    if (textures.atmosphereAlpha) {
      this.atmosphere.alpha = loadTexture(textures.atmosphereAlpha);
    }
  }

  private createMesh = () => {
    const geometry = new THREE.SphereGeometry(this.radius, 1024, 1024);
    let material;
    if (this.type === "star") {
      material = new THREE.MeshBasicMaterial({
        map: this.map,
        lightMapIntensity: 2,
        toneMapped: false,
        color: new THREE.Color(2.5, 2.5, 2.5),
      });
    } else {
      material = new THREE.MeshPhongMaterial({
        map: this.map,
        shininess: 5,
        toneMapped: true,
      });

      if (this.bumpMap) {
        material.bumpMap = this.bumpMap;
        material.bumpScale = this.radius * 10;
      }

      if (this.specularMap) {
        material.specularMap = this.specularMap;
      }
    }

    if (this.type === "spacecraft") {
    }

    const sphere = new THREE.Mesh(geometry, material);
    sphere.rotation.x = this.tilt;
    sphere.castShadow = true;
    sphere.receiveShadow = true;

    return sphere;
  };

  private createAtmosphereMesh = () => {
    const geometry = new THREE.SphereGeometry(this.radius + 0.001, 64, 64);

    const material = new THREE.MeshPhongMaterial({
      map: this.atmosphere?.map,
      transparent: true,
    });

    if (this.atmosphere.alpha) {
      material.alphaMap = this.atmosphere.alpha;
    }

    const sphere = new THREE.Mesh(geometry, material);
    sphere.receiveShadow = true;
    sphere.rotation.x = this.tilt;
    return sphere;
  };

  private loadModel() {
    const loader = new GLTFLoader();
    loader.load(
      this.modelPath!,
      (gltf) => {
        const model = gltf.scene;
        if (this.modelScale) {
          model.scale.set(this.modelScale, this.modelScale, this.modelScale);
        }

        if (this.mesh instanceof THREE.Group) {
          this.mesh.add(model);
        }
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );
  }

  private getRotation = (elapsedTime: number) => {
    return this.daylength ? (elapsedTime * timeFactor) / this.daylength : 0;
  };

  private getOrbitRotation = (elapsedTime: number) => {
    return this.daylength ? (elapsedTime * timeFactor) / (this.period * 24) : 0;
  };

  tick = (elapsedTime: number) => {
    // Convert real-time seconds to rotation.
    const rotation = this.getRotation(elapsedTime);
    const orbitRotation = this.getOrbitRotation(elapsedTime);
    const orbit = orbitRotation + this.rng;

    // Circular rotation around orbit.
    this.mesh.position.x = Math.sin(orbit) * this.distance;
    this.mesh.position.z = Math.cos(orbit) * this.distance;

    if (this.type === "ring") {
      this.mesh.rotation.z = rotation;
    } else {
      this.mesh.rotation.y = rotation;
    }
  };

  getMinDistance = (): number => {
    if (this.type === "spacecraft") {
      return this.radius * 50;
    }
    return this.radius * 3.5;
  };
}

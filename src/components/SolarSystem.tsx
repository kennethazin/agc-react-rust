"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";
import { createEnvironmentMap } from "@/setup/environment-map";
import { createLights } from "@/setup/lights";
import { createSolarSystem } from "@/setup/solar-system";
import { createGUI, options } from "@/setup/gui";

import "@/styles/SolarSystem.css";

declare global {
  interface Window {
    solarSystem: Record<string, any>;
  }
}

const SolarSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup Three.js
    THREE.ColorManagement.enabled = false;

    // Scene
    const scene = new THREE.Scene();

    // Environment map
    scene.background = createEnvironmentMap("./textures/environment");

    // Lights
    const [ambientLight, pointLight] = createLights();
    scene.add(ambientLight, pointLight);

    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Create solar system
    const [solarSystem] = createSolarSystem(scene);

    window.solarSystem = solarSystem;

    // Camera
    const aspect = sizes.width / sizes.height;
    const camera = new THREE.PerspectiveCamera(50, aspect, 0.01, 10000);
    camera.position.set(0, 0, 0.01); // Adjusted position for closer initial zoom
    solarSystem["Lunar Module"].mesh.add(camera);

    // Controls
    const fakeCamera = camera.clone();
    const controls = new OrbitControls(fakeCamera, canvasRef.current);
    controls.target = solarSystem["Sun"].mesh.position;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = solarSystem["Lunar Module"].getMinDistance() / 4; // Reduced minDistance for closer zoom
    controls.maxDistance = 50;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });

    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(sizes.width, sizes.height),
      0.75,
      0,
      1
    );

    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.setSize(sizes.width, sizes.height);
    bloomComposer.renderToScreen = true;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    // Resize handler
    const handleResize = () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderers
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      bloomComposer.setSize(sizes.width, sizes.height);
    };

    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();

    // GUI
    createGUI(ambientLight, solarSystem, clock);
    let elapsedTime = 0;
    let animationFrameId: number;

    const tick = () => {
      elapsedTime += clock.getDelta() * options.speed;

      // Update the solar system objects
      for (const object of Object.values(solarSystem)) {
        object.tick(elapsedTime);
      }

      // Update camera
      camera.copy(fakeCamera);

      // Update controls
      controls.update();

      // Render
      bloomComposer.render();

      // Call tick again on the next frame
      animationFrameId = window.requestAnimationFrame(tick);
    };

    tick();

    // Mock loading process
    const simulateLoading = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setLoadingProgress(progress);
        if (progress >= 100) {
          setIsLoading(false);
          clearInterval(interval);
        }
      }, 100);
    };

    simulateLoading();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationFrameId);

      // Dispose of Three.js resources
      renderer.dispose();
      bloomComposer.dispose();
    };
  }, []);

  return (
    <div className="solar-system-container">
      {isLoading && (
        <div id="loading">
          <div id="welcome">
            <h1>Apollo Landing & AGC Simulation</h1>

            <div id="loader-progress">
              <div id="loader-text">Loading...</div>
              <div id="loader-percentage">{loadingProgress}%</div>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="webgl"></canvas>
    </div>
  );
};

export default SolarSystem;

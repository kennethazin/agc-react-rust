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

      <div className="btn-group">
        <button id="btn-ambient">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M12 24a12 12 0 1 1 12-12 12.013 12.013 0 0 1-12 12zm0-22a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2z" />
              <path d="M12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm0-6a2 2 0 1 0 2 2 2 2 0 0 0-2-2zM11 5h2v2h-2zM11 17h2v2h-2zM17 11h2v2h-2zM5 11h2v2H5zM6 7h2v2H6zM16 7h2v2h-2zM6 15h2v2H6zM16 15h2v2h-2z" />
            </g>
          </svg>
        </button>
        <button id="btn-paths">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M12 24a12 12 0 1 1 12-12 12.013 12.013 0 0 1-12 12zm0-22a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2z" />
              <path d="m7.091 16.91 1.964-7.856 7.854-1.964-1.964 7.856zM10.7 10.7l-.864 3.457L13.3 13.3l.864-3.457z" />
              <path d="m9.171 10.586 1.414-1.414 4.242 4.242-1.414 1.414z" />
            </g>
          </svg>
        </button>
        <button id="btn-settings">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M12 24a12 12 0 1 1 12-12 12.013 12.013 0 0 1-12 12zm0-22a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2z" />
              <path d="M12 17a5 5 0 1 1 5-5 5.006 5.006 0 0 1-5 5zm0-8a3 3 0 1 0 3 3 3 3 0 0 0-3-3z" />
              <path d="M11 5h2v3h-2zM11 16h2v3h-2zM16 11h3v2h-3zM5 11h3v2H5zM14.293 8.293l2-2 1.414 1.414-2 2zM6.293 7.707l1.414-1.414 2 2-1.415 1.414zM6.293 16.293l2-2 1.414 1.414-2 2zM14.293 15.707l1.415-1.414 2 2-1.415 1.414z" />
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SolarSystem;

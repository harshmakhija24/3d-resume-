import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import handleResize from "./utils/resizeUtils";
import setAnimations from "./utils/animationUtils";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef(new THREE.Scene());

  const resizeHandlerRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    const canAfford3D = window.innerWidth > 1024 && !isCoarsePointer && !prefersReducedMotion && !saveData;
    if (!canAfford3D) return;

    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
      const renderScale = window.innerWidth > 1440 ? 0.62 : 0.68;
      renderer.setSize(container.width * renderScale, container.height * renderScale, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.setPixelRatio(1);
      renderer.shadowMap.enabled = false;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      // The model spans roughly y=0 to y=15; center the face above the monitor in the hero frame.
      const cameraTarget = new THREE.Vector3(0, 12.0, 0);
      camera.position.set(0, 11.5, 24.7);
      camera.zoom = 0.85;
      camera.lookAt(cameraTarget);
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let neckBone: THREE.Object3D | null = null;
      const neutralSpinePose = new Map<string, THREE.Euler>();
      const headBaseRotation = new THREE.Euler();
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();
      let isPageVisible = document.visibilityState === "visible";
      let isInViewport = true;
      let animId = 0;
      let lastFrameTime = performance.now();
      let renderUntil = 0;
      let scrollEndTimer: number | undefined;

      const light = setLighting(scene);
      const { loadCharacter } = setCharacter(camera);

      loadCharacter().then((gltf) => {
        if (gltf) {
          const animations = setAnimations(gltf);
          mixer = animations.mixer;
          let character = gltf.scene;
          scene.add(character);
          character.rotation.y = 0.3;
          ["Cube002", "Plane", "Plane002", "Plane003", "Plane004", "screenlight"].forEach((name) => {
            const displayProp = character.getObjectByName(name);
            if (displayProp) displayProp.visible = false;
          });
          headBone = character.getObjectByName("spine006") || character.getObjectByName("spine.006") || null;
          neckBone = character.getObjectByName("spine005") || character.getObjectByName("spine.005") || null;
          ["spine", "spine001", "spine002", "spine003", "spine005", "spine006"].forEach((name) => {
            const bone = character.getObjectByName(name);
            if (bone) neutralSpinePose.set(name, bone.rotation.clone());
          });
          if (headBone) {
            headBone.rotation.x = 0.04;
            headBone.rotation.y = 0;
            headBaseRotation.copy(headBone.rotation);
          }
          if (neckBone) neckBone.rotation.x = 0.6;
          screenLight = character.getObjectByName("screenlight") || null;
          light.turnOnLights();
          animations.startIntro(() => {
            neutralSpinePose.forEach((rotation, name) => {
              const bone = character.getObjectByName(name);
              if (bone) bone.rotation.copy(rotation);
            });
            if (headBone) {
              headBone.rotation.copy(headBaseRotation);
              headBone.rotation.x = 0.04;
            }
            if (neckBone) neckBone.rotation.x = 0.6;
          });
          renderUntil = performance.now() + 2400;
          startRenderLoop();
          const onResize = () => handleResize(renderer, camera, canvasDiv, character);
          window.addEventListener("resize", onResize);
          resizeHandlerRef.current = onResize;
        }
      });

      const requestRender = (duration = 260) => {
        renderUntil = Math.max(renderUntil, performance.now() + duration);
        startRenderLoop();
      };
      const stopRenderLoop = () => {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = 0;
        }
      };

      const renderLoop = (time: number) => {
        if (!isPageVisible || !isInViewport || (!headBone && time > renderUntil)) {
          animId = 0;
          return;
        }

        if (time - lastFrameTime < 1000 / 30) {
          animId = requestAnimationFrame(renderLoop);
          return;
        }

        const delta = Math.min((time - lastFrameTime) / 1000, 0.05);
        lastFrameTime = time;

        if (headBone) {
          light.setPointLight(screenLight);
        }
        if (mixer) {
          mixer.update(delta || clock.getDelta());
        }
        camera.lookAt(cameraTarget);
        if (headBone) {
          const idleTime = time * 0.001;
          headBone.rotation.x = headBaseRotation.x + Math.sin(idleTime * 0.65) * 0.012;
          headBone.rotation.y = headBaseRotation.y + Math.sin(idleTime * 0.45) * 0.018;
        }
        renderer.render(scene, camera);
        animId = requestAnimationFrame(renderLoop);
      };

      const startRenderLoop = () => {
        if (!animId && isPageVisible && isInViewport) {
          lastFrameTime = performance.now();
          animId = requestAnimationFrame(renderLoop);
        }
      };

      const onVisibilityChange = () => {
        isPageVisible = document.visibilityState === "visible";
        if (isPageVisible) requestRender(1200);
        else stopRenderLoop();
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      const onScroll = () => {
        stopRenderLoop();
        window.clearTimeout(scrollEndTimer);
        scrollEndTimer = window.setTimeout(() => requestRender(180), 140);
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      const observer = new IntersectionObserver(
        ([entry]) => {
          isInViewport = entry.isIntersecting;
          if (isInViewport) startRenderLoop();
          else stopRenderLoop();
        },
        { threshold: 0.02 }
      );
      observer.observe(canvasDiv.current);
      startRenderLoop();

      return () => {
        window.clearTimeout(scrollEndTimer);
        stopRenderLoop();
        observer.disconnect();
        document.removeEventListener("visibilitychange", onVisibilityChange);
        window.removeEventListener("scroll", onScroll);
        scene.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const material = mesh.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else if (material) material.dispose();
        });
        scene.clear();
        renderer.dispose();
        if (resizeHandlerRef.current) {
          window.removeEventListener("resize", resizeHandlerRef.current);
          resizeHandlerRef.current = null;
        }
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
                        <div className="character-rim"></div>

        </div>
      </div>
    </>
  );
};

export default Scene;

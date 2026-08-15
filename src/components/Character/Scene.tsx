import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import setAnimations from "./utils/animationUtils";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = canvasDiv.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
    );
    const canAfford3D = window.innerWidth > 1024 && !isCoarsePointer && !prefersReducedMotion && !saveData;
    if (!canAfford3D) return;

    const rect = container.getBoundingClientRect();
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    // Keep the hero crisp while leaving headroom for page scrolling and text.
    const renderScale = window.innerWidth >= 1800 ? 0.74 : 0.78;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.15);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(Math.max(1, rect.width * renderScale), Math.max(1, rect.height * renderScale), false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.shadowMap.enabled = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, rect.width / Math.max(rect.height, 1), 0.1, 1000);
    const cameraTarget = new THREE.Vector3(0, 12.0, 0);
    camera.position.set(0, 11.5, 24.7);
    camera.zoom = 0.85;
    camera.lookAt(cameraTarget);
    camera.updateProjectionMatrix();

    const lighting = setLighting(scene);
    const clock = new THREE.Clock();
    let character: THREE.Object3D | null = null;
    let headBone: THREE.Object3D | null = null;
    let neckBone: THREE.Object3D | null = null;
    let headBaseRotation = new THREE.Euler();
    let neckBaseRotation = new THREE.Euler();
    let mixer: THREE.AnimationMixer | null = null;
    let animationId = 0;
    let lastRenderTime = 0;
    let isPageVisible = document.visibilityState === "visible";
    let isInViewport = false;
    let isScrolling = false;
    let scrollStopTimer = 0;
    let cancelled = false;

    const stopRenderLoop = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = 0;
      }
    };

    const renderLoop = (timestamp = performance.now()) => {
      if (cancelled || !isPageVisible || !isInViewport || !character) {
        animationId = 0;
        return;
      }

      // The page does not need a 60 FPS hero loop; reserving those frames for
      // scrolling makes the transition feel immediate without killing the idle.
      if (timestamp - lastRenderTime < 1000 / 30) {
        animationId = requestAnimationFrame(renderLoop);
        return;
      }
      lastRenderTime = timestamp;

      const delta = Math.min(clock.getDelta(), 0.05);
      mixer?.update(delta);

      if (headBone) {
        // Keep the model-authored neutral gaze; source clips must not pull the face down.
        headBone.rotation.copy(headBaseRotation);
      }
      if (neckBone) neckBone.rotation.copy(neckBaseRotation);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(renderLoop);
    };

    const startRenderLoop = () => {
      if (!animationId && isPageVisible && isInViewport && !isScrolling && character) {
        clock.start();
        animationId = requestAnimationFrame(renderLoop);
      }
    };

    const onScroll = () => {
      isScrolling = true;
      stopRenderLoop();
      window.clearTimeout(scrollStopTimer);
      scrollStopTimer = window.setTimeout(() => {
        isScrolling = false;
        startRenderLoop();
      }, 110);
    };

    const onVisibilityChange = () => {
      isPageVisible = document.visibilityState === "visible";
      if (isPageVisible && !isScrolling) startRenderLoop();
      else stopRenderLoop();
    };

    const onResize = () => {
      const nextRect = container.getBoundingClientRect();
      if (!nextRect.width || !nextRect.height) return;
      camera.aspect = nextRect.width / nextRect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(Math.max(1, nextRect.width * renderScale), Math.max(1, nextRect.height * renderScale), false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.15));
      startRenderLoop();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
        if (isInViewport) startRenderLoop();
        else stopRenderLoop();
      },
      { threshold: 0.08 },
    );
    observer.observe(container);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    const { loadCharacter } = setCharacter();
    loadCharacter()
      .then((gltf) => {
        if (cancelled) return;
        character = gltf.scene;
        // A neutral yaw keeps the character looking straight at the viewer.
        character.rotation.y = 0;
        character.traverse((object: any) => {
          if (["Cube002", "Plane", "Plane002", "Plane003", "Plane004", "screenlight"].includes(object.name)) {
            object.visible = false;
          }
        });

        const animations = setAnimations(gltf);
        mixer = animations.mixer;
        headBone = character.getObjectByName("spine006") || character.getObjectByName("spine.006") || null;
        neckBone = character.getObjectByName("spine005") || character.getObjectByName("spine.005") || null;

        if (headBone) {
          // Lift the authored pitch into a direct viewer-facing pose while preserving yaw/roll.
          headBaseRotation.copy(headBone.rotation);
          headBaseRotation.x = 0.20;
        }
        if (neckBone) {
          neckBaseRotation.copy(neckBone.rotation);
          neckBaseRotation.x = 0.06;
        }

        scene.add(character);
        container.classList.add("character-loaded");
        lighting.turnOnLights();
        animations.startIntro(() => {
          if (headBone) headBone.rotation.copy(headBaseRotation);
          if (neckBone) neckBone.rotation.copy(neckBaseRotation);
        });
        startRenderLoop();
      })
      .catch(() => {
        // The hero text and portfolio remain fully usable if WebGL or the model fails.
      });

    return () => {
      cancelled = true;
      container.classList.remove("character-loaded");
      stopRenderLoop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollStopTimer);
      window.removeEventListener("resize", onResize);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose();
      });
      scene.clear();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="character-container" aria-hidden="true">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-placeholder" aria-hidden="true">
          <div className="character-placeholder-glow" />
        </div>
        <div className="character-rim" />
      </div>
    </div>
  );
};

export default Scene;

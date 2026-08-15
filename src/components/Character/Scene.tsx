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
    const renderScale = window.innerWidth >= 1800 ? 0.82 : 0.88;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.35);
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
    let isPageVisible = document.visibilityState === "visible";
    let isInViewport = false;
    let cancelled = false;

    const stopRenderLoop = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = 0;
      }
    };

    const renderLoop = () => {
      if (cancelled || !isPageVisible || !isInViewport || !character) {
        animationId = 0;
        return;
      }

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
      if (!animationId && isPageVisible && isInViewport && character) {
        clock.start();
        animationId = requestAnimationFrame(renderLoop);
      }
    };

    const onVisibilityChange = () => {
      isPageVisible = document.visibilityState === "visible";
      if (isPageVisible) startRenderLoop();
      else stopRenderLoop();
    };

    const onResize = () => {
      const nextRect = container.getBoundingClientRect();
      if (!nextRect.width || !nextRect.height) return;
      camera.aspect = nextRect.width / nextRect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(Math.max(1, nextRect.width * renderScale), Math.max(1, nextRect.height * renderScale), false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
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
          <svg className="character-placeholder-art" viewBox="0 0 480 620" role="presentation">
            <defs>
              <linearGradient id="placeholderSkin" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#d59b79" />
                <stop offset="0.55" stopColor="#a9644e" />
                <stop offset="1" stopColor="#63362e" />
              </linearGradient>
              <linearGradient id="placeholderHoodie" x1="0" y1="0" x2="0.8" y2="1">
                <stop offset="0" stopColor="#26332d" />
                <stop offset="1" stopColor="#0d1411" />
              </linearGradient>
              <linearGradient id="placeholderCap" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#a3b19b" />
                <stop offset="1" stopColor="#4c5b50" />
              </linearGradient>
            </defs>
            <ellipse cx="240" cy="578" rx="154" ry="22" fill="rgba(0,0,0,0.32)" />
            <path d="M84 574c5-109 54-179 156-179s151 70 156 179H84Z" fill="url(#placeholderHoodie)" />
            <path d="M155 416c24 30 51 44 85 44s61-14 85-44l-20-35H175l-20 35Z" fill="#17221c" />
            <ellipse cx="240" cy="280" rx="119" ry="132" fill="url(#placeholderSkin)" />
            <ellipse cx="119" cy="286" rx="30" ry="46" fill="#8c4d3f" />
            <ellipse cx="361" cy="286" rx="30" ry="46" fill="#8c4d3f" />
            <path d="M120 236c13-103 69-148 120-148s107 45 120 148c-43-26-79-38-120-38s-77 12-120 38Z" fill="url(#placeholderCap)" />
            <path d="M110 228c42-31 81-43 130-43s88 12 130 43c-22 19-52 27-130 27s-108-8-130-27Z" fill="#34453b" />
            <path d="M157 284c20-20 51-24 76-7-18 30-57 33-76 7Z" fill="#1a211e" />
            <path d="M247 277c25-17 56-13 76 7-19 26-58 23-76-7Z" fill="#1a211e" />
            <ellipse cx="211" cy="288" rx="10" ry="15" fill="#d5efab" />
            <ellipse cx="269" cy="288" rx="10" ry="15" fill="#d5efab" />
            <circle cx="212" cy="290" r="5" fill="#18201c" />
            <circle cx="268" cy="290" r="5" fill="#18201c" />
            <path d="M234 295c-4 31-3 42 17 44" fill="none" stroke="#7a4438" strokeWidth="8" strokeLinecap="round" />
            <path d="M183 357c31 28 82 28 114 0" fill="none" stroke="#3d241f" strokeWidth="14" strokeLinecap="round" />
            <path d="M197 359c26 10 60 10 86 0" fill="none" stroke="#f1eee6" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="character-rim" />
      </div>
    </div>
  );
};

export default Scene;

import * as THREE from "three";
import gsap from "gsap";

let charTimelines: gsap.core.Timeline[] = [];

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  charTimelines.forEach((timeline) => timeline.kill());
  charTimelines = [];

  if (!character || window.innerWidth <= 1024) return;

  let screenLight: any;
  character.traverse((object: any) => {
    if (["Cube002", "Plane", "Plane002", "Plane003", "Plane004", "screenlight"].includes(object.name)) {
      object.visible = false;
      object.traverse((child: any) => {
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material: any) => {
            material.transparent = true;
            material.opacity = 0;
          });
        }
      });
    }

    if (object.name === "screenlight" && object.material) {
      object.material.transparent = true;
      object.material.opacity = 0;
      object.material.emissive?.set("#B0F5EA");
      object.material.emissiveIntensity = 1.8;
      screenLight = object;
    }
  });

  const neckBone = character.getObjectByName("spine005") || character.getObjectByName("spine.005");
  const heroTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  heroTimeline
    .to(character.rotation, { y: 0.3, duration: 1 }, 0)
    .to(camera.position, { z: 22.5, duration: 1 }, 0)
    .to(character.position, { x: -2.1, duration: 1 }, 0)
    .to(".landing-container", { opacity: 0, duration: 0.4 }, 0.55)
    .to(".character-model", { opacity: 0, duration: 0.3 }, 0.58);

  const workTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  workTimeline
    .to(camera.position, { z: 29, y: 9.8, duration: 4, ease: "power3.inOut" }, 0)
    .to(character.position, { x: -1.3, duration: 3 }, 0)
    .to(character.rotation, { y: 0.46, x: 0.04, duration: 3 }, 0)
    .to(neckBone?.rotation ?? {}, { x: 0.08, duration: 3 }, 0)
    .to(screenLight?.material ?? {}, { opacity: 1, duration: 0.8 }, 1.2);

  charTimelines.push(heroTimeline, workTimeline);
}

export function setAllTimeline() {
  // Content sections remain visible by default. The previous implementation
  // targeted removed class names and could leave cards or progress bars hidden
  // after direct-anchor navigation, so there is intentionally no global content
  // timeline here.
}

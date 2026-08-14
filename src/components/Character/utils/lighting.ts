import * as THREE from "three";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  const ambient = new THREE.HemisphereLight(0xe8f1e6, 0x101610, 1.25);
  scene.add(ambient);

  const directionalLight = new THREE.DirectionalLight(0xd7f3df, 0);
  directionalLight.position.set(-4, 8, 8);
  directionalLight.castShadow = false;
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xb9ffd0, 0, 40, 2);
  pointLight.position.set(3, 8, 5);
  pointLight.castShadow = false;
  scene.add(pointLight);

  function setPointLight(screenLight: any) {
    if (screenLight?.material?.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 8;
    } else {
      pointLight.intensity = 0;
    }
  }

  function turnOnLights() {
    gsap.to(directionalLight, {
      intensity: 1.25,
      duration: 1.4,
      ease: "power2.out",
    });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 1.6,
      ease: "power2.out",
    });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;

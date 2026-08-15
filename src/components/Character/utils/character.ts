import { GLTF, GLTFLoader } from "three-stdlib";

const setCharacter = () => {
  const loader = new GLTFLoader();

  const loadCharacter = () =>
    new Promise<GLTF>((resolve, reject) => {
      loader.load(
        `${import.meta.env.BASE_URL}models/character_unencrypted.glb`,
        (gltf) => {
          gltf.scene.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = false;
              child.receiveShadow = false;
              child.frustumCulled = true;
            }
          });

          const footR = gltf.scene.getObjectByName("footR");
          const footL = gltf.scene.getObjectByName("footL");
          if (footR) footR.position.y = 3.36;
          if (footL) footL.position.y = 3.36;

          resolve(gltf);
        },
        undefined,
        (error) => {
          console.warn("3D hero skipped; portfolio remains fully usable.", error);
          reject(error);
        },
      );
    });

  return { loadCharacter };
};

export default setCharacter;

// The loader intentionally has no camera or scroll-timeline side effects.
// The character belongs to the landing hero only and is disposed with that scene.

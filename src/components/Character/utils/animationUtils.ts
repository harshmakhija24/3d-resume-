import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { eyebrowBoneNames, typingBoneNames } from "../../../data/boneData";

const setAnimations = (gltf: GLTF) => {
  const character = gltf.scene;
  const mixer = new THREE.AnimationMixer(character);
  const introClip = gltf.animations.find((clip) => clip.name === "introAnimation");
  const introAction = introClip ? mixer.clipAction(introClip) : null;

  if (introAction) {
    introAction.setLoop(THREE.LoopOnce, 1);
    introAction.clampWhenFinished = false;
  }

  if (gltf.animations) {
    // The source file contains several overlapping key poses. Playing them together
    // makes the head wander and reads as accidental motion. Keep one body loop and
    // a restrained hand/typing layer for a calmer, more intentional hero presence.
    const idleClip = THREE.AnimationClip.findByName(gltf.animations, "key1");
    if (idleClip) {
      const idleAction = mixer.clipAction(idleClip);
      idleAction.play();
      idleAction.timeScale = 0.72;
      idleAction.setEffectiveWeight(0.62);
    }

    const typingAction = createBoneAction(gltf, mixer, "typing", typingBoneNames);
    if (typingAction) {
      typingAction.enabled = true;
      typingAction.play();
      typingAction.timeScale = 0.72;
      typingAction.setEffectiveWeight(0.38);
    }
  }

  function startIntro(onComplete?: () => void) {
    if (!introAction) {
      onComplete?.();
      return;
    }

    const finishListener = (event: THREE.Event & { action?: THREE.AnimationAction }) => {
      if (event.action !== introAction) return;
      introAction.stop();
      mixer.removeEventListener("finished", finishListener);
      onComplete?.();
    };

    mixer.addEventListener("finished", finishListener);
    introAction.reset().fadeIn(0.25).play();

    window.setTimeout(() => {
      const blink = gltf.animations.find((clip) => clip.name === "Blink");
      if (blink) mixer.clipAction(blink).play().fadeIn(0.5);
    }, 3600);
  }

  function hover(gltf: GLTF, hoverDiv: HTMLDivElement) {
    const eyeBrowUpAction = createBoneAction(
      gltf,
      mixer,
      "browup",
      eyebrowBoneNames
    );
    let isHovering = false;
    if (eyeBrowUpAction) {
      eyeBrowUpAction.setLoop(THREE.LoopOnce, 1);
      eyeBrowUpAction.clampWhenFinished = true;
      eyeBrowUpAction.enabled = true;
    }
    const onHoverFace = () => {
      if (eyeBrowUpAction && !isHovering) {
        isHovering = true;
        eyeBrowUpAction.reset();
        eyeBrowUpAction.enabled = true;
        eyeBrowUpAction.setEffectiveWeight(4);
        eyeBrowUpAction.fadeIn(0.5).play();
      }
    };
    const onLeaveFace = () => {
      if (eyeBrowUpAction && isHovering) {
        isHovering = false;
        eyeBrowUpAction.fadeOut(0.6);
      }
    };
    if (!hoverDiv) return;
    hoverDiv.addEventListener("mouseenter", onHoverFace);
    hoverDiv.addEventListener("mouseleave", onLeaveFace);
    return () => {
      hoverDiv.removeEventListener("mouseenter", onHoverFace);
      hoverDiv.removeEventListener("mouseleave", onLeaveFace);
    };
  }

  return { mixer, startIntro, hover };
};

const createBoneAction = (
  gltf: GLTF,
  mixer: THREE.AnimationMixer,
  clip: string,
  boneNames: string[]
): THREE.AnimationAction | null => {
  const animationClip = THREE.AnimationClip.findByName(gltf.animations, clip);
  if (!animationClip) return null;

  const filteredClip = filterAnimationTracks(animationClip, boneNames);
  return mixer.clipAction(filteredClip);
};

const filterAnimationTracks = (
  clip: THREE.AnimationClip,
  boneNames: string[]
): THREE.AnimationClip => {
  const filteredTracks = clip.tracks.filter((track) =>
    boneNames.some((boneName) => track.name.includes(boneName))
  );

  return new THREE.AnimationClip(
    `${clip.name}_filtered`,
    clip.duration,
    filteredTracks
  );
};

export default setAnimations;

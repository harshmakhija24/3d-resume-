import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

interface ParaElement extends HTMLElement {
  anim?: gsap.core.Animation;
  split?: SplitText;
}

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function setSplitText() {
  const paras: NodeListOf<ParaElement> = document.querySelectorAll(".para");
  const titles: NodeListOf<ParaElement> = document.querySelectorAll(".title");
  const clearSplits = (elements: NodeListOf<ParaElement>) => {
    elements.forEach((element) => {
      element.anim?.progress(1).kill();
      element.split?.revert();
      element.anim = undefined;
      element.split = undefined;
    });
  };

  if (window.innerWidth < 900) {
    clearSplits(paras);
    clearSplits(titles);
    ScrollTrigger.refresh();
    return;
  }

  ScrollTrigger.config({ ignoreMobileResize: true });

  const TriggerStart = window.innerWidth <= 1024 ? "top 60%" : "20% 60%";
  const ToggleAction = "play none none reverse";

  paras.forEach((para: ParaElement) => {
    para.classList.add("visible");
    para.anim?.progress(1).kill();
    para.split?.revert();
    para.anim = undefined;
    para.split = undefined;

    // About Me is the first content handoff after the hero. Keeping its copy
    // intact prevents clipped words and lets the section arrive as one calm,
    // readable block while the later sections retain their reveal treatment.
    if (para.closest(".about-section")) return;

    para.split = new SplitText(para, {
      type: "lines,words",
      linesClass: "split-line",
    });

    para.anim = gsap.fromTo(
      para.split.words,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: para.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 0.72,
        ease: "power3.out",
        y: 0,
        stagger: 0.012,
      }
    );
  });
  titles.forEach((title: ParaElement) => {
    title.anim?.progress(1).kill();
    title.split?.revert();
    title.anim = undefined;
    title.split = undefined;

    // The About heading should land with its copy, not arrive as a delayed
    // character cascade immediately after the hero.
    if (title.closest(".about-section")) return;

    title.split = new SplitText(title, {
      type: "chars,lines",
      linesClass: "split-line",
    });
    title.anim = gsap.fromTo(
      title.split.chars,
      { autoAlpha: 0, y: 80, rotate: 10 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: title.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 0.8,
        ease: "power2.inOut",
        y: 0,
        rotate: 0,
        stagger: 0.03,
      }
    );
  });

}

import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

export function initialFX() {
  document.body.style.overflowY = "auto";
  document.getElementsByTagName("main")[0].classList.add("main-active");
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);


  var landingText = new SplitText(
    [
      ".landing-info h3", 
      ".landing-intro h2", 
      ".landing-tagline"
    ],
    {
      type: "chars,lines",
      linesClass: "split-line",
    }
  );
  
  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 0.55,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.015,
      delay: 0.04,
    }
  );

  gsap.fromTo(
    ".landing-intro h1",
    { opacity: 0, y: 48, filter: "blur(4px)" },
    {
      opacity: 1,
      duration: 0.6,
      filter: "blur(0px)",
      ease: "power3.out",
      y: 0,
      delay: 0.04,
    }
  );

  gsap.fromTo(
    [".landing-status", ".landing-stats", ".landing-ctas"],
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      duration: 0.5,
      ease: "power1.inOut",
      y: 0,
      stagger: 0.06,
      delay: 0.08,
    }
  );

  gsap.fromTo(
    [".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.45,
      ease: "power1.inOut",
      delay: 0.04,
    }
  );
}

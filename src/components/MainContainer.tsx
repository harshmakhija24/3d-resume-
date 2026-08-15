import { PropsWithChildren, useEffect } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";

import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import Presentations from "./Presentations";
import setSplitText from "./utils/splitText";


const MainContainer = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    let resizeFrame = 0;
    let resizeTimer: number | undefined;
    const resizeHandler = () => {
      window.cancelAnimationFrame(resizeFrame);
      window.clearTimeout(resizeTimer);
      resizeFrame = window.requestAnimationFrame(() => {
        resizeTimer = window.setTimeout(() => setSplitText(), 120);
      });
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler, { passive: true });
    window.addEventListener("orientationchange", resizeHandler, { passive: true });
    return () => {
      window.cancelAnimationFrame(resizeFrame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("orientationchange", resizeHandler);
    };
  }, []);

  return (
    <div className="container-main">
      <Navbar />
      <SocialIcons />
      <Landing>{children}</Landing>
      <About />
      <WhatIDo />
      <Career />
      <Work />
      <Presentations />
      <Contact />
    </div>
  );
};

export default MainContainer;

import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (!cursor || prefersReducedMotion || isCoarsePointer) return;

    let hover = false;
    let animationId = 0;
    let hasPointerMoved = false;
    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };

    const handleMouseMove = (event: MouseEvent) => {
      mousePos.x = event.clientX;
      mousePos.y = event.clientY;
      hasPointerMoved = true;
    };

    const handleEnter = (event: Event) => {
      const element = event.currentTarget as HTMLElement;
      const rect = element.getBoundingClientRect();

      if (element.dataset.cursor === "icons") {
        cursor.classList.add("cursor-icons");
        gsap.to(cursor, { x: rect.left, y: rect.top, duration: 0.1, overwrite: true });
        cursor.style.setProperty("--cursorH", `${rect.height}px`);
        hover = true;
      }
      if (element.dataset.cursor === "disable") {
        cursor.classList.add("cursor-disable");
      }
    };

    const handleLeave = () => {
      cursor.classList.remove("cursor-disable", "cursor-icons");
      hover = false;
    };

    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-cursor]"));
    items.forEach((item) => {
      item.addEventListener("mouseenter", handleEnter);
      item.addEventListener("mouseleave", handleLeave);
    });
    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    const loop = () => {
      if (!hover && hasPointerMoved) {
        const nextX = cursorPos.x + (mousePos.x - cursorPos.x) / 7;
        const nextY = cursorPos.y + (mousePos.y - cursorPos.y) / 7;
        if (Math.abs(nextX - cursorPos.x) > 0.1 || Math.abs(nextY - cursorPos.y) > 0.1) {
          cursorPos.x = nextX;
          cursorPos.y = nextY;
          cursor.style.transform = `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`;
        }
      }
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("mousemove", handleMouseMove);
      items.forEach((item) => {
        item.removeEventListener("mouseenter", handleEnter);
        item.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef} aria-hidden="true" />;
};

export default Cursor;

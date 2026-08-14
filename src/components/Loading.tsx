import { useEffect } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

const Loading = () => {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(async () => {
      if (cancelled) return;

      setIsLoading(false);

      try {
        const module = await import("./utils/initialFX");
        if (!cancelled) {
          window.requestAnimationFrame(() => module.initialFX?.());
        }
      } catch (error) {
        console.warn("Entrance animation skipped", error);
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [setIsLoading]);

  return (
    <div className="loading-screen" role="status" aria-label="Loading portfolio">
      <div className="loading-minimal">
        <span className="loading-mark">HM</span>
        <span className="loading-label">Preparing the portfolio</span>
        <span className="loading-dot" aria-hidden="true" />
      </div>
    </div>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent = 0;
  let interval = window.setInterval(() => {
    percent = Math.min(percent + 5, 100);
    setLoading(percent);
    if (percent >= 100) window.clearInterval(interval);
  }, 40);

  function clear() {
    window.clearInterval(interval);
    percent = 100;
    setLoading(percent);
  }

  function loaded() {
    clear();
    return Promise.resolve(100);
  }

  return { loaded, percent, clear };
};

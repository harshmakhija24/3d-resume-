import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Keep the hero layout bundle versioned when visual-only CSS changes ship.
createRoot(document.getElementById("root")!).render(
  <App />
);

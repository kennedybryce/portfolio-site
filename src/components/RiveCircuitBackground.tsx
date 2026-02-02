import { useRive } from "@rive-app/react-canvas";
import { useState, useEffect } from "react";

interface RiveCircuitBackgroundProps {
  opacity?: number;
  height?: string;
}

export default function RiveCircuitBackground({
  opacity = 0.15,
  height = "100vh",
}: RiveCircuitBackgroundProps) {
  const src = `${import.meta.env.BASE_URL}icons/circuit-bg.riv`;
  const [theme, setTheme] = useState<string>("dark");

  // Listen for theme changes
  useEffect(() => {
    const html = document.documentElement;
    const updateTheme = () => {
      setTheme(html.getAttribute("data-theme") || "dark");
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  const { RiveComponent } = useRive({
    src,
    artboard: "circuit-animation",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  // Invert colors for light mode (white becomes black)
  const getFilterStyle = (): React.CSSProperties => {
    if (theme === "light") {
      return { filter: "invert(1)" };
    }
    return {};
  };

  return (
    <div
      className="fixed inset-x-0 pointer-events-none -z-10 overflow-hidden"
      style={{
        top: 0,
        height,
        opacity,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          ...getFilterStyle(),
        }}
      >
        <RiveComponent
          style={{
            width: "100%",
            height: "200%",
            position: "absolute",
            top: 0,
            left: 0,
            transform: "translateY(-25%)",
          }}
        />
      </div>
    </div>
  );
}

import * as RiveReact from "@rive-app/react-canvas";
import { useState, useEffect } from "react";

const { useRive, useStateMachineInput } = RiveReact;

interface RiveBackButtonProps {
  href?: string;
  width?: number;
  height?: number;
}

export default function RiveBackButton({
  href = "../",
  width = 140,
  height = 32,
}: RiveBackButtonProps) {
  const src = `${import.meta.env.BASE_URL}icons/portfolio-icons.riv`;
  const [isHovered, setIsHovered] = useState(false);
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

  const { rive, RiveComponent } = useRive({
    src,
    artboard: "back",
    stateMachines: "state-machine-01",
    autoplay: true,
  });

  const hoverInput = useStateMachineInput(rive, "state-machine-01", "isHovered");

  // Sync hover state to Rive animation
  useEffect(() => {
    if (hoverInput) {
      hoverInput.value = isHovered;
    }
  }, [hoverInput, isHovered]);

  // Get filter based on theme and hover state
  const getFilterStyle = (): React.CSSProperties => {
    if (isHovered) {
      if (theme === "light") {
        // Orange filter for light mode (#FA4816)
        return {
          filter: "brightness(0) saturate(100%) invert(44%) sepia(97%) saturate(2467%) hue-rotate(346deg) brightness(99%) contrast(97%)"
        };
      }
      // Blue filter for dark mode (#3980ff)
      return {
        filter: "brightness(0) saturate(100%) invert(43%) sepia(98%) saturate(2080%) hue-rotate(205deg) brightness(101%) contrast(101%)"
      };
    }

    // Default: white in dark mode, black in light mode
    if (theme === "light") {
      return { filter: "brightness(0)" };
    }
    return { filter: "brightness(0) invert(1)" };
  };

  return (
    <a
      href={href}
      className="inline-block mb-8 transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Back to projects"
    >
      <div
        className="transition-all duration-200"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          ...getFilterStyle(),
        }}
      >
        <RiveComponent style={{ width: "100%", height: "100%" }} />
      </div>
    </a>
  );
}

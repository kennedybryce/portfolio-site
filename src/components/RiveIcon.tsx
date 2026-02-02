import * as RiveReact from "@rive-app/react-canvas";
import { useCallback, useState, useEffect } from "react";

const { useRive, useStateMachineInput } = RiveReact;

interface RiveIconProps {
  artboard: string;
  stateMachine?: string;
  hoverInputName?: string;
  label?: string;
  className?: string;
  themeAware?: boolean;
  size?: "xs" | "small" | "large";
}

export default function RiveIcon({
  artboard,
  stateMachine = "state-machine-01",
  hoverInputName = "isHovered",
  label = artboard,
  className = "",
  themeAware = true,
  size = "small",
}: RiveIconProps) {
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
    artboard,
    stateMachines: stateMachine,
    autoplay: true,
  });

  const hoverInput = useStateMachineInput(rive, stateMachine, hoverInputName);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (hoverInput) {
      hoverInput.value = true;
    }
  }, [hoverInput]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (hoverInput) {
      hoverInput.value = false;
    }
  }, [hoverInput]);

  const sizeClasses = {
    xs: "w-6 h-6",
    small: "w-8 h-8",
    large: "w-14 h-14",
  };

  // Determine filter based on theme and hover state
  // Default: white in dark mode, black in light mode
  // Hovered: blue in dark mode, orange in light mode
  const getFilterStyle = (): React.CSSProperties => {
    if (!themeAware) return {};

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

    if (theme === "light") {
      return { filter: "invert(1)" }; // Invert white to black in light mode
    }

    return {}; // Dark mode: no filter (white is fine)
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}
      aria-label={label}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full h-full transition-all duration-200" style={getFilterStyle()}>
        <RiveComponent style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}

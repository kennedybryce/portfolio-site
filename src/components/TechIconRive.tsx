import * as RiveReact from "@rive-app/react-canvas";
import { useCallback, useState, useEffect } from "react";

const { useRive, useStateMachineInput } = RiveReact;

interface TechIconRiveProps {
  artboard: string;
  label: string;
  stateMachine?: string;
  hoverInputName?: string;
  size?: "small" | "large";
  externalHovered?: boolean; // Allow parent to control hover state
  isSelected?: boolean; // Keep icon highlighted when selected
}

export default function TechIconRive({
  artboard,
  label,
  stateMachine = "state-machine-01",
  hoverInputName = "isHovered",
  size = "small",
  externalHovered,
  isSelected = false,
}: TechIconRiveProps) {
  const src = `${import.meta.env.BASE_URL}icons/portfolio-icons.riv`;
  const [internalHovered, setInternalHovered] = useState(false);
  const [theme, setTheme] = useState<string>("dark");

  // Use external hover state if provided, otherwise use internal
  // isSelected keeps the icon highlighted even when not hovered
  const isHovered = isSelected || (externalHovered !== undefined ? externalHovered : internalHovered);

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

  // Sync hover state to Rive animation
  useEffect(() => {
    if (hoverInput) {
      hoverInput.value = isHovered;
    }
  }, [hoverInput, isHovered]);

  const handleMouseEnter = useCallback(() => {
    if (externalHovered === undefined) {
      setInternalHovered(true);
    }
  }, [externalHovered]);

  const handleMouseLeave = useCallback(() => {
    if (externalHovered === undefined) {
      setInternalHovered(false);
    }
  }, [externalHovered]);

  const sizeClasses = {
    small: {
      container: "w-14",
      button: "p-2",
      icon: "w-5 h-5",
      label: "text-[10px]",
    },
    large: {
      container: "w-16",
      button: "p-3",
      icon: "w-8 h-8",
      label: "text-xs",
    },
  };

  const classes = sizeClasses[size];

  // Determine filter based on theme and hover state
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

    if (theme === "light") {
      return { filter: "invert(1)" }; // Invert white to black in light mode
    }

    return {}; // Dark mode: no filter (white is fine)
  };

  // Determine border color based on theme and hover state
  const getBorderStyle = (): React.CSSProperties => {
    if (isHovered) {
      if (theme === "light") {
        return { borderColor: "#FA4816" }; // Orange for light mode
      }
      return { borderColor: "#3980ff" }; // Blue for dark mode
    }
    // Default border color (matching border-gray-dark/70)
    return { borderColor: "rgba(84, 86, 90, 0.7)" };
  };

  // Determine label color based on theme and hover state
  const getLabelStyle = (): React.CSSProperties => {
    if (isHovered) {
      if (theme === "light") {
        return { color: "#FA4816" }; // Orange for light mode
      }
      return { color: "#3980ff" }; // Blue for dark mode
    }
    return {}; // Default color handled by className
  };

  return (
    <div
      className={`flex flex-col items-center ${classes.container} ${size === "large" ? "gap-2" : "gap-1"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`${classes.button} rounded-full border bg-surface-card transition-all duration-200`}
        style={getBorderStyle()}
      >
        <div
          className={`${classes.icon} transition-all duration-200`}
          style={getFilterStyle()}
        >
          <RiveComponent style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
      <span
        className={`${classes.label} text-slate-400 transition-colors duration-200`}
        style={getLabelStyle()}
      >
        {label}
      </span>
    </div>
  );
}

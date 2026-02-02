import * as RiveReact from "@rive-app/react-canvas";
import { useCallback, useState, useEffect } from "react";

const { useRive, useStateMachineInput } = RiveReact;

interface RiveActionButtonProps {
  artboard: string;
  stateMachine?: string;
  hoverInputName?: string;
  text: string;
  subtitle?: string;
  href: string;
  variant?: "primary" | "secondary";
  download?: boolean;
  external?: boolean;
}

export default function RiveActionButton({
  artboard,
  stateMachine = "state-machine-01",
  hoverInputName = "isHovered",
  text,
  subtitle,
  href,
  variant = "secondary",
  download = false,
  external = false,
}: RiveActionButtonProps) {
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

  // Determine filter based on variant, theme, and hover state
  const getFilterStyle = (): React.CSSProperties => {
    if (variant === "primary") {
      // Primary button: always white icon
      return { filter: "brightness(0) invert(1)" };
    }

    // Secondary button: theme-aware colors
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

  const variantClasses = {
    primary: "border-brand-orange bg-brand-orange text-white hover:opacity-90",
    secondary: "btn-secondary btn-secondary-border text-text-light hover:text-brand-orange hover:border-brand-orange",
  };

  const linkProps: Record<string, unknown> = {};
  if (download) linkProps.download = true;
  if (external) {
    linkProps.target = "_blank";
    linkProps.rel = "noopener noreferrer";
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full md:w-auto">
      <a
        href={href}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 border transition w-full md:w-auto ${variantClasses[variant]}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...linkProps}
      >
        <div
          className="w-5 h-5 transition-all duration-200"
          style={getFilterStyle()}
        >
          <RiveComponent style={{ width: "100%", height: "100%" }} />
        </div>
        {text}
      </a>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}

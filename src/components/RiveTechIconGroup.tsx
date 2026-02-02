import { useState, useEffect, useRef } from "react";
import TechIconRive from "./TechIconRive";

interface IconConfig {
  artboard: string;
  label: string;
}

interface RiveTechIconGroupProps {
  icons: IconConfig[];
  size?: "small" | "large";
}

export default function RiveTechIconGroup({
  icons,
  size = "small",
}: RiveTechIconGroupProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find the parent card (element with class "group")
    const container = containerRef.current;
    if (!container) return;

    // Walk up the DOM to find the card with class "group"
    let parentCard: HTMLElement | null = container.parentElement;
    while (parentCard && !parentCard.classList.contains("group")) {
      parentCard = parentCard.parentElement;
    }

    if (!parentCard) {
      // No parent card found, use the container itself for hover detection
      parentCard = container;
    }

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    parentCard.addEventListener("mouseenter", handleMouseEnter);
    parentCard.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parentCard?.removeEventListener("mouseenter", handleMouseEnter);
      parentCard?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-wrap justify-start">
      {icons.map((icon, index) => (
        <TechIconRive
          key={`${icon.artboard}-${index}`}
          artboard={icon.artboard}
          label={icon.label}
          size={size}
          externalHovered={isHovered}
        />
      ))}
    </div>
  );
}

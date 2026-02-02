import { useState, useEffect, useRef, useCallback } from "react";
import TechIconRive from "./TechIconRive";

interface TechItem {
  artboard: string;
  label: string;
  description: string;
}

const techItems: TechItem[] = [
  {
    artboard: "angular",
    label: "Angular",
    description:
      "I use Angular for building large-scale enterprise applications with complex state management and strict typing. Its opinionated structure makes it ideal for teams working on long-term projects.",
  },
  {
    artboard: "react",
    label: "React",
    description:
      "React is my go-to for building interactive UIs and component libraries. I leverage hooks and context for state management, and appreciate its flexibility for projects of any size.",
  },
  {
    artboard: "astro",
    label: "Astro",
    description:
      "I use Astro for content-focused websites where performance is critical. Its island architecture lets me ship minimal JavaScript while still integrating React components where needed.",
  },
  {
    artboard: "flutter",
    label: "Flutter",
    description:
      "Flutter enables me to build beautiful, natively compiled mobile applications from a single codebase. I use it for cross-platform projects requiring consistent UI across iOS and Android.",
  },
  {
    artboard: "typescript",
    label: "TypeScript",
    description:
      "TypeScript is essential to my workflow for catching errors early and improving code maintainability. I use it across all my JavaScript projects to ensure type safety and better developer experience.",
  },
  {
    artboard: "javascript",
    label: "JavaScript",
    description:
      "JavaScript remains foundational to everything I build on the web. I have deep knowledge of the language, from ES6+ features to async patterns and DOM manipulation.",
  },
  {
    artboard: "wordpress",
    label: "WordPress",
    description:
      "I build custom WordPress themes and plugins using Advanced Custom Fields for flexible content management. It's my preferred CMS for clients who need an intuitive editing experience.",
  },
  {
    artboard: "rive",
    label: "Rive",
    description:
      "Rive allows me to create interactive, state-driven animations that respond to user input. I use it to add polish and delight to interfaces without sacrificing performance.",
  },
  {
    artboard: "tailwind",
    label: "Tailwind",
    description:
      "Tailwind CSS accelerates my styling workflow with utility-first classes. I use it to build consistent, responsive designs quickly while maintaining a clean component structure.",
  },
];

const CYCLE_INTERVAL = 8000; // 8 seconds between each icon

interface TechIconShowcaseProps {
  size?: "small" | "large";
}

export default function TechIconShowcase({ size = "large" }: TechIconShowcaseProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const [theme, setTheme] = useState<string>("dark");
  const [isPaused, setIsPaused] = useState(false);
  const cycleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedTech = techItems[selectedIndex]?.artboard || null;
  const selectedItem = techItems[selectedIndex];

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

  // Handle visibility animation when selection changes
  useEffect(() => {
    // Small delay to trigger fade-in animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [selectedIndex]);

  // Start auto-cycling on mount
  const startCycleTimer = useCallback(() => {
    if (cycleTimerRef.current) {
      clearInterval(cycleTimerRef.current);
    }
    cycleTimerRef.current = setInterval(() => {
      if (!isPaused) {
        setIsVisible(false);
        setTimeout(() => {
          setSelectedIndex((prev) => (prev + 1) % techItems.length);
        }, 150);
      }
    }, CYCLE_INTERVAL);
  }, [isPaused]);

  // Initialize auto-cycling
  useEffect(() => {
    startCycleTimer();
    return () => {
      if (cycleTimerRef.current) {
        clearInterval(cycleTimerRef.current);
      }
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, [startCycleTimer]);

  // Get highlight color based on theme
  const getHighlightColor = () => {
    return theme === "light" ? "#FA4816" : "#3980ff";
  };

  const handleIconClick = (index: number) => {
    // Pause auto-cycling when user interacts
    setIsPaused(true);

    // Clear any existing resume timer
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    if (selectedIndex === index) {
      // Clicking the same icon - just restart the timer
      setIsPaused(false);
      startCycleTimer();
    } else {
      // Switch to clicked icon with fade
      setIsVisible(false);
      setTimeout(() => {
        setSelectedIndex(index);
      }, 150);
    }

    // Resume auto-cycling after 12 seconds of no interaction
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
      startCycleTimer();
    }, 12000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-6 text-sm justify-center md:justify-start pt-4">
        {techItems.map((item, index) => (
          <button
            key={item.artboard}
            type="button"
            onClick={() => handleIconClick(index)}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleIconClick(index);
            }}
            className="focus:outline-none touch-manipulation"
            aria-label={`Learn about ${item.label}`}
          >
            <TechIconRive
              artboard={item.artboard}
              label={item.label}
              size={size}
              isSelected={selectedTech === item.artboard}
            />
          </button>
        ))}
      </div>

      {/* Description area with fixed height and fade animation */}
      <div className="h-20 md:h-16 border-t border-gray-dark/50 pt-2">
        <p
          className={`text-slate-300 text-sm md:text-base transition-opacity duration-300 ease-in-out ${
            selectedItem && isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {selectedItem && (
            <>
              <span className="font-semibold" style={{ color: getHighlightColor() }}>
                {selectedItem.label}:
              </span>{" "}
              {selectedItem.description}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

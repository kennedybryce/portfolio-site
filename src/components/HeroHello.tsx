import { useEffect, useState } from "react";

export default function HeroHello() {
  const [greeting, setGreeting] = useState("Hello!");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning!");
    else if (hour < 18) setGreeting("Good afternoon!");
    else setGreeting("Good evening!");
  }, []);

  return (
    <div className="space-y-3 text-sm md:text-base">
      <div className="text-xs uppercase tracking-[0.25em] text-sky-300/80">
        React island · Live
      </div>
      <div className="text-lg font-medium">
        {greeting} <span className="text-sky-300">I’m Bryce.</span>
      </div>
      <p className="text-slate-300 text-sm">
        This panel is rendered as a React component inside an Astro page. Soon,
        this is where we’ll wire in more advanced interactions and your Rive
        animations.
      </p>
      <p className="text-xs text-slate-500">
        Status: {mounted ? "hydrated and interactive" : "initializing…"}
      </p>
    </div>
  );
}

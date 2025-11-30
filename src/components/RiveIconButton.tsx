import * as RiveReact from "@rive-app/react-canvas";

const { useRive, useStateMachineInput } = RiveReact;

interface RiveIconButtonProps {
  artboard: string;
  stateMachine?: string;
  clickInputName?: string;
  href?: string;
  label?: string;
  className?: string;
}

export default function RiveIconButton({
  artboard,
  stateMachine = "HoverClick",
  clickInputName = "Click",
  href,
  label = artboard,
  className = "",
}: RiveIconButtonProps) {
  const src = `${import.meta.env.BASE_URL}animations/icons.riv`;

  const { rive, RiveComponent } = useRive({
    src,
    artboard,
    stateMachines: stateMachine,
    autoplay: true,
  });

  const clickInput = useStateMachineInput(rive, stateMachine, clickInputName);

  const handleClick = () => {
    if (clickInput) {
      // Trigger input (has fire())
      // @ts-ignore
      if (typeof clickInput.fire === "function") {
        // @ts-ignore
        clickInput.fire();
      } else {
        // Boolean/number input – toggle or bump
        // @ts-ignore
        clickInput.value = !clickInput.value;
      }
    }

    if (href) {
      if (href.startsWith("http") || href.startsWith("mailto:")) {
        window.location.href = href;
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 hover:border-sky-400/80 hover:bg-slate-800/80 transition p-2 w-12 h-12 md:w-14 md:h-14 ${className}`}
      aria-label={label}
    >
      <RiveComponent style={{ width: "100%", height: "100%" }} />
    </button>
  );
}

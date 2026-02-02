import * as RiveReact from "@rive-app/react-canvas";

const { useRive, useStateMachineInput } = RiveReact;

interface RiveIconButtonProps {
  artboard: string;
  stateMachine?: string;
  clickInputName?: string;
  href?: string;
  label?: string;
  className?: string;
  themeAware?: boolean;
}

export default function RiveIconButton({
  artboard,
  stateMachine = "state-machine-01",
  clickInputName = "click",
  href,
  label = artboard,
  className = "",
  themeAware = true,
}: RiveIconButtonProps) {
  const src = `${import.meta.env.BASE_URL}icons/portfolio-icons.riv`;

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
      className={`inline-flex items-center justify-center rounded-full border border-gray-dark/70 bg-surface-card hover:border-brand-orange/50 transition p-2 w-12 h-12 md:w-14 md:h-14 ${className}`}
      aria-label={label}
    >
      <div className={themeAware ? "brightness-0 invert w-full h-full" : "w-full h-full"}>
        <RiveComponent style={{ width: "100%", height: "100%" }} />
      </div>
    </button>
  );
}



/* <div class="flex gap-3 pt-4">
                      <RiveIconButton
                        client:load
                        artboard="calendar"
                        stateMachine="State Machine 1"
                        clickInputName="calendarClicked"
                        href="mailto:you@example.com"
                        label="Email Bryce"
                      />
                      <RiveIconButton
                        client:load
                        artboard="calendar"
                        stateMachine="State Machine 1"
                        clickInputName="calendarClicked"
                        href="mailto:you@example.com"
                        label="Email Bryce"
                      />
                    </div> */
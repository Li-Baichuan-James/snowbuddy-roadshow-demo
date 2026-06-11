import { useEffect, useState } from "react";
import { normalizeDegrees } from "../lib/direction";

type DeviceOrientationWithCompass = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

type DeviceOrientationEventConstructorWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export type CompassHeading = {
  heading: number;
  source: "device" | "simulated";
  statusLabel: "Compass live" | "Simulated heading";
};

const SIMULATED_STEP_DEGREES = 4;

function getDeviceHeading(event: DeviceOrientationWithCompass): number | null {
  if (typeof event.webkitCompassHeading === "number") {
    return normalizeDegrees(event.webkitCompassHeading);
  }

  if (typeof event.alpha === "number") {
    return normalizeDegrees(360 - event.alpha);
  }

  return null;
}

export function useCompassHeading(): CompassHeading {
  const [heading, setHeading] = useState(0);
  const [source, setSource] = useState<"device" | "simulated">("simulated");

  useEffect(() => {
    let receivedDeviceHeading = false;
    let cancelled = false;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const nextHeading = getDeviceHeading(event as DeviceOrientationWithCompass);
      if (nextHeading === null) return;

      receivedDeviceHeading = true;
      setSource("device");
      setHeading((current) => current + (nextHeading - current) * 0.35);
    };

    const startListening = () => {
      window.addEventListener("deviceorientation", handleOrientation, true);
    };

    const eventConstructor = window.DeviceOrientationEvent as DeviceOrientationEventConstructorWithPermission | undefined;

    if (eventConstructor?.requestPermission) {
      const requestOnFirstTouch = () => {
        eventConstructor.requestPermission?.()
          .then((permission) => {
            if (cancelled || permission !== "granted") return;
            startListening();
          })
          .catch(() => {
            setSource("simulated");
          });
      };

      window.addEventListener("pointerdown", requestOnFirstTouch, { once: true });

      return () => {
        cancelled = true;
        window.removeEventListener("pointerdown", requestOnFirstTouch);
        window.removeEventListener("deviceorientation", handleOrientation, true);
      };
    }

    if (eventConstructor) {
      startListening();
    }

    const fallbackTimer = window.setInterval(() => {
      if (receivedDeviceHeading) return;
      setSource("simulated");
      setHeading((current) => normalizeDegrees(current + SIMULATED_STEP_DEGREES));
    }, 2200);

    return () => {
      cancelled = true;
      window.clearInterval(fallbackTimer);
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  return {
    heading: normalizeDegrees(heading),
    source,
    statusLabel: source === "device" ? "Compass live" : "Simulated heading"
  };
}

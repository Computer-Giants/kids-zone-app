import type { TelemetryEvent } from "@kidzone/validators";

/**
 * Lightweight, zero-dependency first-party client telemetry dispatcher.
 * Adheres strictly to project privacy rules:
 * - AC-1: Zero third-party trackers, external scripts, or pixels.
 * - AC-4: Dispatches anonymous event pings to /api/telemetry/event.
 * - Safe for guest mode and authenticated children alike.
 */
export function sendTelemetry(event: TelemetryEvent): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload = JSON.stringify(event);

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      const sent = navigator.sendBeacon("/api/telemetry/event", blob);
      if (sent) return;
    }

    // Fallback to fetch with keepalive
    fetch("/api/telemetry/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Fire-and-forget failure silently ignored
    });
  } catch {
    // Failures silently absorbed to never interrupt child learning
  }
}

import { logAnonymousTelemetry } from "@kidzone/observability";
import { telemetryEventSchema } from "@kidzone/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const telemetry = new Hono()
  /**
   * AC-2, AC-3 in spec 0014:
   * Anonymous telemetry endpoint.
   * Discards network IP addresses, cookies, and user agent fingerprints.
   * Sanitizes payloads through @kidzone/observability.
   */
  .post("/event", zValidator("json", telemetryEventSchema), async (c) => {
    const payload = c.req.valid("json");

    // Strictly first-party anonymous processing
    logAnonymousTelemetry(payload);

    return c.json({ ok: true });
  });

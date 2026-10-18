import { logger } from "./index";

export interface AnonymousTelemetryPayload {
  eventType: string;
  entityType?: string | null;
  entityId?: string | null;
  ageBand: string;
  durationBucket: string;
  status: string;
}

/**
 * Standardized anonymous telemetry logger.
 * Strips any user identifiable attributes and emits clean structured metrics.
 * Satisfies AC-3 and AC-5 in spec 0014.
 */
export function logAnonymousTelemetry(event: AnonymousTelemetryPayload) {
  // Sanitize payload: strictly pick anonymous fields
  const safeEvent = {
    type: "anonymous_telemetry",
    eventType: event.eventType,
    entityType: event.entityType ?? null,
    entityId: event.entityId ?? null,
    ageBand: event.ageBand,
    durationBucket: event.durationBucket,
    status: event.status,
    timestamp: new Date().toISOString(),
  };

  logger.info({ telemetry: safeEvent }, "anonymous_telemetry_event");
}

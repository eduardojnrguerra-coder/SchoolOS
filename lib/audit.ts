export function auditLogPlaceholder(event: string, actorId: string) {
  return { event, actorId, at: new Date().toISOString() };
}

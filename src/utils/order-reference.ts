import { randomBytes } from "node:crypto";

export function createOrderReference(): string {
  const token = randomBytes(6).toString("hex").toUpperCase();
  return `WMKC-${token.slice(0, 4)}-${token.slice(4)}`;
}

export function getOrderReference(
  clientReferenceId: string | null,
  sessionId: string,
): string {
  return clientReferenceId ?? `WMKC-${sessionId.slice(-8).toUpperCase()}`;
}

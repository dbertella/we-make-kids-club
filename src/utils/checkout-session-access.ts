import { createHmac, timingSafeEqual } from 'node:crypto';

export const CHECKOUT_ACCESS_COOKIE = 'wmkc_checkout_access';

const sessionIdPattern = /^cs_(test|live)_[A-Za-z0-9]+$/;

const signPayload = (payload: string, secret: string) =>
  createHmac('sha256', secret).update(payload).digest('hex');

export function createCheckoutAccessToken(
  sessionId: string,
  expiresAt: number,
  secret: string,
) {
  const payload = `${sessionId}.${expiresAt}`;
  return `${payload}.${signPayload(payload, secret)}`;
}

export function verifyCheckoutAccessToken(
  token: string | undefined,
  expectedSessionId: string,
  secret: string,
  now = Math.floor(Date.now() / 1000),
) {
  if (!token || !sessionIdPattern.test(expectedSessionId)) return false;

  const [sessionId, expiryText, signature, ...extraParts] = token.split('.');
  if (
    extraParts.length > 0 ||
    sessionId !== expectedSessionId ||
    !/^\d+$/.test(expiryText ?? '') ||
    !/^[a-f0-9]{64}$/.test(signature ?? '')
  ) {
    return false;
  }

  const expiresAt = Number(expiryText);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) return false;

  const payload = `${sessionId}.${expiryText}`;
  const expectedSignature = Buffer.from(signPayload(payload, secret), 'hex');
  const actualSignature = Buffer.from(signature, 'hex');

  return (
    expectedSignature.length === actualSignature.length &&
    timingSafeEqual(expectedSignature, actualSignature)
  );
}

export function createCheckoutAccessCookie(
  token: string,
  expiresAt: number,
  now = Math.floor(Date.now() / 1000),
) {
  const maxAge = Math.max(0, expiresAt - now);
  const secure = import.meta.env.PROD ? '; Secure' : '';
  return `${CHECKOUT_ACCESS_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}

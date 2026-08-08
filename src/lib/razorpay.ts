import { createHmac, timingSafeEqual } from 'crypto';

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

export async function createOrder({
  keyId,
  keySecret,
  amountPaise,
  receiptId,
  notes,
}: {
  keyId: string;
  keySecret: string;
  amountPaise: number;
  receiptId: string;
  notes: Record<string, string>;
}): Promise<RazorpayOrder> {
  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt: receiptId,
      notes,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Razorpay createOrder failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<RazorpayOrder>;
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  keySecret: string,
): boolean {
  const payload = `${orderId}|${paymentId}`;
  const expected = createHmac('sha256', keySecret).update(payload).digest('hex');

  const expectedBuf = Buffer.from(expected, 'utf8');
  const signatureBuf = Buffer.from(signature, 'utf8');

  if (expectedBuf.length !== signatureBuf.length) {
    return false;
  }

  return timingSafeEqual(expectedBuf, signatureBuf);
}

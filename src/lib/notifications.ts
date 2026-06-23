/**
 * Notification service — triggered after every new inquiry.
 *
 * Channels (all optional — activate by setting env vars):
 *  1. WhatsApp Business Cloud API (template message to admin)
 *  2. Generic HTTP webhook  (Zapier / Make / n8n)
 *  3. Console log (dev fallback — always runs if nothing else fires)
 *
 * The function never throws — failures are logged but never block the caller.
 */

export interface InquiryPayload {
  id:            string;
  name:          string;
  email:         string;
  phone?:        string;
  message:       string;
  propertyTitle?:string;
  propertySlug?: string;
}

// ─── WhatsApp Business Cloud API ─────────────────────────────────
async function sendWhatsApp(payload: InquiryPayload): Promise<void> {
  const token   = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const adminTo = process.env.WHATSAPP_ADMIN_PHONE; // e.g. "5215512345678"

  if (!token || !phoneId || !adminTo) return;

  // Template "nuevo_lead" must be approved in Meta Business Manager.
  // Body variables (in order): {{1}} = name, {{2}} = email,
  //   {{3}} = phone, {{4}} = property, {{5}} = message (first 120 chars)
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${phoneId}/messages`,
    {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to:                adminTo,
        type:              "template",
        template: {
          name:     "nuevo_lead",
          language: { code: "es_MX" },
          components: [
            {
              type:       "body",
              parameters: [
                { type: "text", text: payload.name },
                { type: "text", text: payload.email },
                { type: "text", text: payload.phone ?? "No proporcionado" },
                { type: "text", text: payload.propertyTitle ?? "Consulta general" },
                { type: "text", text: payload.message.slice(0, 120) },
              ],
            },
          ],
        },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`WhatsApp API error ${res.status}: ${body}`);
  }
}

// ─── Generic HTTP webhook ─────────────────────────────────────────
async function sendWebhook(payload: InquiryPayload): Promise<void> {
  const url = process.env.NOTIFICATION_WEBHOOK_URL;
  if (!url) return;

  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({
      event:   "new_inquiry",
      timestamp: new Date().toISOString(),
      data:    payload,
    }),
  });

  if (!res.ok) throw new Error(`Webhook error ${res.status}`);
}

// ─── Public API ───────────────────────────────────────────────────
export async function notifyNewInquiry(payload: InquiryPayload): Promise<void> {
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    console.log("[notify] New inquiry:", payload);
  }

  // Fire all channels concurrently; catch individual failures so one
  // failing channel never blocks the others.
  const results = await Promise.allSettled([
    sendWhatsApp(payload),
    sendWebhook(payload),
  ]);

  results.forEach((r) => {
    if (r.status === "rejected") {
      console.error("[notify] Channel failed:", r.reason);
    }
  });
}

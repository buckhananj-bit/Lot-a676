import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "STRIPE_SECRET_KEY not set on Vercel." });
    }

    const { plate, region = "", phone, lot } = req.body || {};

    if (!plate || !phone || !lot?.lotCode || !lot?.addressLine1) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Pricing: $75.00 + $0.35 = $75.35
    const EVENT_AMOUNT_CENTS = 7500;
    const SERVICE_FEE_CENTS  = 35;
    const TOTAL_CENTS = EVENT_AMOUNT_CENTS + SERVICE_FEE_CENTS;

    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host;
    const baseUrl = `${proto}://${host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "pay",
      success_url: `${baseUrl}/success.html`,
      cancel_url: `${baseUrl}/cancel.html`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Event Parking",
              description: `[${lot.lotCode}] ${lot.addressLine1} — ${lot.cityLine || ""}`.trim()
            },
            unit_amount: TOTAL_CENTS
          },
          quantity: 1
        }
      ],
      metadata: {
        plate,
        region,
        phone,
        operator: lot.operator || "Diamonds Parking Services",
        lot_code: lot.lotCode || "",
        lot_address: lot.addressLine1 || "",
        lot_city: lot.cityLine || ""
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Server error creating checkout session." });
  }
}
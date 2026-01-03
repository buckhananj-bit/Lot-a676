import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { plate, region = "", phone, lot } = req.body || {};

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Missing STRIPE_SECRET_KEY on server." });
    }

    if (!plate || !phone || !lot?.lotCode || !lot?.addressLine1) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Fixed Event Rate
    const EVENT_AMOUNT_CENTS = 7500;
    const SERVICE_FEE_CENTS = 35;

    const baseUrl =
      (req.headers["x-forwarded-proto"] || "https") +
      "://" +
      req.headers.host;

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
            unit_amount: EVENT_AMOUNT_CENTS + SERVICE_FEE_CENTS
          },
          quantity: 1
        }
      ],
      metadata: {
        plate,
        region,
        phone,
        operator: lot.operator || "",
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
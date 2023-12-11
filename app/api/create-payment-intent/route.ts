// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const amount = body.amount;
  if (typeof amount !== "number") {
    return Response.json({}, { status: 400, statusText: "Invalid amount" });
  }

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "jpy",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return Response.json({ clientSecret: paymentIntent.client_secret });
}

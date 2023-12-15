import prisma from "@/lib/prisma";

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const amount = body.amount;
  const userId = body.id;
  if (typeof amount !== "number" || typeof userId !== "string") {
    return Response.json({}, { status: 400, statusText: "Invalid amount" });
  }
  const user = await prisma.stripeCustomer.findUnique({ where: { userId } });

  const customer = user
    ? await stripe.customers.retrieve(user.stripeCustomerId)
    : await stripe.customers.create();

  // If there is no user, create one
  if (!user) {
    await prisma.stripeCustomer.create({
      data: { userId, stripeCustomerId: customer.id },
    });
  }

  const paymentMethods = await stripe.customers.listPaymentMethods(
    customer.id,
    {
      limit: 1,
    }
  );
  console.log(paymentMethods);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    customer: customer.id,
    setup_future_usage: "off_session",
    amount,
    currency: "jpy",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    payment_method: paymentMethods.data[0].id ?? undefined,
  });

  return Response.json({ clientSecret: paymentIntent.client_secret });
}

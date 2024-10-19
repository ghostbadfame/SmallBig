import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import Razorpay from 'razorpay';
import { connect } from '@/database/mongo.config'; // Adjust path as necessary
import Order from '@/models/Order'; // Adjust path as necessary

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connect(); // Ensure we're connected to the database

    const { leadId } = await request.json();
    console.log('Lead ID received:', leadId); // Log the received leadId

    const receipt = `lead_${leadId}`.substring(0, 40); // Ensure receipt is no longer than 40 characters

    const options = {
      amount: 100 * 100, // amount in paisa (100 INR)
      currency: "INR",
      receipt: receipt,
    };

    const order = await razorpay.orders.create(options);

    // Save order to MongoDB
    const newOrder = new Order({
      orderId: order.id,
      username: session.user?.name || 'Unknown User',
      leadId: leadId,
    });

    await newOrder.save();

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

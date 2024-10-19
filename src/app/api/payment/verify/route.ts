import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import crypto from "crypto";
import { connect } from "@/database/mongo.config";
import LeadModel from "@/models/Leads";

interface PaymentVerificationPayload {
  orderCreationId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  leadId: string;
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET as string;

  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

// Named export for the POST method
export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      await connect();
      
      const payload = await req.json();
      console.log("Received payload:", payload); // Debugging the incoming payload
  
      const {
          orderId,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          leadId,
      } = payload;
  
      const signature = generatedSignature(razorpayOrderId, razorpayPaymentId);
      console.log("Generated signature:", signature); // Debugging the generated signature
      console.log("Received signature:", razorpaySignature); // Debugging the received signature
  
      if (signature !== razorpaySignature) {
          return NextResponse.json(
              { message: "Payment verification failed", isOk: false },
              { status: 400 }
          );
      } else {
          await LeadModel.updateOne(
              { _id: leadId },
              { $set: { emailRevealed: true } }
          );
          return NextResponse.json(
            { message: "Payment verification succeded", isOk: true },
            { status: 200 }
        );
         
      }
  } catch (error) {
      console.error("Error verifying payment:", error);
      return NextResponse.json(
          { error: "Failed to verify payment", details: error }, // Include error details for better debugging
          { status: 500 }
      );
  }
  
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}

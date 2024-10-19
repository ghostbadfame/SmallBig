// src/models/Order.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface OrderDocument extends Document {
  orderId: string;
  username: string;
  leadId: string;
}

const orderSchema = new Schema<OrderDocument>({
  orderId: { type: String, required: true },
  username: { type: String, required: true },
  leadId: { type: String, required: true },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model<OrderDocument>('Order', orderSchema);

export default Order;

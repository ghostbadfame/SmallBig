// models/Leads.ts
import mongoose from 'mongoose';

// Define the Lead interface
export interface Lead {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  companyName: string;
  linkedinProfile: string;
  jobTitle: string;
  emailAddress: string;
  phoneNumber: string;
  emailRevealed: boolean;
}

// Create a schema for the Lead model
const leadSchema = new mongoose.Schema<Lead>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  companyName: { type: String, required: true },
  linkedinProfile: { type: String, required: true },
  jobTitle: { type: String, required: true },
  emailAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailRevealed: { type: Boolean, required: true },
}, { collection: 'leads' });

// Prevent overwriting the model
const LeadModel = mongoose.models.Lead || mongoose.model<Lead>('Lead', leadSchema);

// Export the Lead model
export default LeadModel;

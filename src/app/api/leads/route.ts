import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import LeadModel, { Lead } from '@/models/Leads';
import { connect } from '@/database/mongo.config';


// Function to connect to the database and fetch leads
const fetchLeadsFromMongoDB = async (page: number, pageSize: number): Promise<{ leads: Lead[]; total: number }> => {
  connect(); // Ensure the database connection is established

  try {
    // Fetch total leads count
    const total = await LeadModel.countDocuments();

    // Fetch paginated leads
    const leads = await LeadModel.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    return { leads, total };
  } catch (error) {
    console.error('Error fetching leads from MongoDB:', error);
    throw new Error('Error fetching leads'); // Rethrow the error for handling in the API route
  }
};

export async function GET(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10); // Make page size configurable

  try {
    const { leads, total } = await fetchLeadsFromMongoDB(page, pageSize);

    return NextResponse.json({
      leads,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

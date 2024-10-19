// Used this code to push the leads data into MongoDB Database

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = process.env.MONGO_URL
const client = new MongoClient(uri);

const insertLeads = async () => {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    
    // Specify the database and collection
    const database = client.db('test'); // Replace with your database name
    const collection = database.collection('leads'); // Replace with your collection name

    // Read leads data from JSON file
    const filePath = path.join(process.cwd(), 'src/lib/leads_data.json'); // Adjust the path if needed
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const { leads } = JSON.parse(jsonData);

    // Insert leads into the collection
    const result = await collection.insertMany(leads);
    console.log(`${result.insertedCount} leads were inserted.`);
  } catch (error) {
    console.error('Error inserting leads:', error);
  } finally {
    // Close the connection
    await client.close();
  }
};

insertLeads();

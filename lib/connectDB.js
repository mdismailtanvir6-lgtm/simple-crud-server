import { MongoClient } from "mongodb";
import "dotenv/config";

const uri =
  process.env.MONGODB_URI ||
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1gsxqgl.mongodb.net/`;

const client = new MongoClient(uri);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.error("You failed to connect to MongoDB!");
    throw err;
  }
}

// Database
const connectedClient = await connectToMongoDB();
const database = connectedClient.db(process.env.DB_NAME || "simple-crud");

//  collections
export const usersCollection = database.collection("users");
export const jobsCollection = database.collection("jobs");
export const companiesCollection = database.collection("companies");

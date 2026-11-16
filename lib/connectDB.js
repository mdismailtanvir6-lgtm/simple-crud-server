import { MongoClient } from "mongodb";
import "dotenv/config";

const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1gsxqgl.mongodb.net/`,
);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
    console.log("You failed to connect to MongoDB!");
  }
}

// Database
const connectedClient = await connectToMongoDB();
const database = connectedClient.db("simple-crud");

// Users collection
export const usersCollection = database.collection("users");


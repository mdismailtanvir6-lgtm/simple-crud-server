import express from "express";
import cors from "cors";

import { usersCollection } from "./lib/connectDB.js";

const app = express();

// CORS Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

// JSON Middleware
app.use(express.json());

// Port ===
const port = 5000;



app.get("/", (req, res) => {
  res.send("Hello World from the server!");
});

// ==== users =====
app.get("/users", async (req, res) => {
  const cursor = usersCollection.find({});
  const users = await cursor.toArray();

  res.send(users);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

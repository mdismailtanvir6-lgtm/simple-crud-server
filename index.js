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

// ==== get users =====
app.get("/users", async (req, res) => {
  const cursor = usersCollection.find({});
  const users = await cursor.toArray();

  res.send(users);
});

// ==== post users =====
app.post("/users", async (req, res) => {
  const newUser = req.body;

  try {
    await usersCollection.insertOne(newUser);

    res.status(201).send({
      success: true,
      message: "User created successfully.",
    });
  } catch (error) {
    console.error("Error creating user:", error);

    res.status(500).send({
      success: false,
      message: "Failed to create user.",
    });
  }
});

// ===== app listen =====
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

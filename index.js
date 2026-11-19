// index.js
import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.route.js";

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Port
const port = 5000;

// Root
app.get("/", (req, res) => {
  res.send("Hello World from the server!");
});

// Mount routes
app.use("/users", usersRouter);

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

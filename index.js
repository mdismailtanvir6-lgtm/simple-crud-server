import express from "express";

const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World from the server!");
});

// ==== users =====
const users = [
  {
    id: 1,
    name: "Rahim Ahmed",
    email: "rahim.ahmed@example.com",
    age: 25,
    role: "user",
    isActive: true,
  },
];
app.get("/users", (req, res) => {
  res.send(users);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

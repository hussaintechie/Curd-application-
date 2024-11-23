const express = require("express");
const cors = require("cors");
const user = require("./data.json");
const fs = require("fs");
const app = express();
const port = 8000;

app.use(cors({
  methods: ["GET", "POST", "PATCH", "DELETE"]
})); // Enable CORS

app.use(express.json()); // Middleware to parse JSON bodies

// Display all users
app.get('/users', (req, res) => {
  return res.json(user);
});

// Add a user
app.post('/users', (req, res) => {
  const newUser = req.body;
  newUser.id = user.length ? user[user.length - 1].id + 1 : 1; // Generate a new ID
  user.push(newUser);
  fs.writeFile("./data.json", JSON.stringify(user), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to add user" });
    }
    return res.json(newUser);
  });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  let id = Number(req.params.id);
  let filteredUsers = user.filter((user) => user.id !== id);
  fs.writeFile("./data.json", JSON.stringify(filteredUsers), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete user" });
    }
    return res.json(filteredUsers);
  });
});

// Update a user
app.patch('/users/:id', (req, res) => {
  let id = Number(req.params.id);
  let updatedUser = req.body;
  let userIndex = user.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    user[userIndex] = { ...user[userIndex], ...updatedUser };
    fs.writeFile("./data.json", JSON.stringify(user), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update user" });
      }
      return res.json(user[userIndex]);
    });
  } else {
    return res.status(404).json({ error: "User not found" });
  }
});

app.listen(port, (err) => {
  if (err) {
    console.error("Error starting the server:", err);
  } else {
    console.log(`App is running on port ${port}`);
  }
});

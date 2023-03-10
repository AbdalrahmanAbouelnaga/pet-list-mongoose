const mongoose = require('mongoose')
const path = require('path');
if (!process.env.MONGO_URL) {
  throw new Error("Please add the MONGO_URL environment variable");
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const database = mongoose.connection;

database.on(
  "error",
  console.error.bind(console, "❌ mongodb connection error"),
);
database.once("open", () => console.log("✅ mongodb connected successfully"));


const express = require('express')
const userRoutes = require('./routes/users')
const petRoutes = require('./routes/pets')

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'uploads')));
app.get("/", async (req, res) => {
  res.json({ message: "Sign up at /signup" });
});

app.use('/',userRoutes)
app.use('/',petRoutes)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

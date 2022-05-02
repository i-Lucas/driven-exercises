import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
  db = mongoClient.db("cadastra-ai-v2");
});

const app = express();
app.use(express.json());

app.post("/sign-up", async (req, res) => {

  const user = req.body;
  const passwordHash = bcrypt.hashSync(user.password, 10);

  try {

    await db.collection("users").insertOne({ ...user, passwordHash });
    res.sendStatus(201);

  } catch (error) {
    res.sendStatus(500);
  }

  res.sendStatus(201);
});

app.post("/sign-in", async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await db.collection("users").findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }

  } catch (error) {
    res.sendStatus(500);
  }

});

app.listen(5000, () => {
  console.log('Server is listening on port 5000.');
});

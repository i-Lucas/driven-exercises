import { MongoClient } from 'mongodb';
import { v4 as uuid } from 'uuid';
import express from 'express';
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
  const passwordHash = bcrypt.hashSync(password, 10);
  await db.collection('users').insertOne({ ...user, password: passwordHash })
  res.sendStatus(201);
});

app.post("/sign-in", async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await db.collection('users').findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {

      const token = uuid();
      await db.collection('sessions').insertOne({ token, userId: user._id });

    } else {
      res.sendStatus(401);
    }
  } catch {
    res.sendStatus(500);
  }

});

app.get("/meus-dados", async (req, res) => {
  // Receba um token pelo header Authorization
  // Retorne o usuário logado (objeto contendo id, nome e email)
  // Caso não seja enviado o token ou não encontrado, retorne status 401

  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '').trim();

  if (!token) {
    return res.sendStatus(401);
  }

  try {

    const session = await db.collection('sessions').findOne({ token });
    if (!session) {
      return res.sendStatus(401);
    }

    const user = await db.collection('users').findOne({ _id: session.userId });
    if (!user) {
      return res.sendStatus(401);
    }

    res.json(user);

  } catch {
    res.sendStatus(500);
  }


});

app.listen(5000, () => {
  console.log('Server is listening on port 5000.');
});

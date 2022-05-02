import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
  db = mongoClient.db("airline_tickets");
});

const app = express();
app.use(express.json());

app.get('/tickets', async (req, res) => {
  try {
    const tickets = await db.collection('tickets').find().toArray();
    res.send(tickets);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get('/tickets/:number', async (req, res) => {

  const number = req.params.number;

  const regex = /^[a-zA-Z]{3}[0-9]{4}$/;
  const numberSchema = joi.string().pattern(regex).required();
  const validation = numberSchema.validate(number);

  if (validation.error) return res.sendStatus(422);

  try {
    const ticket = await db.collection('tickets').findOne({ number })
    if (!ticket) {
      return res.sendStatus(404);
    }

    res.send(ticket);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/tickets', async (req, res) => {
  const ticket = req.body;

  // validar
  const regex = /^[a-zA-Z]{3}[0-9]{4}$/;

  const ticketSchema = joi.object({
    full_name: joi.string().required(),
    age: joi.number().integer().required(),
    ticket_number: joi.string().pattern(regex).required()
  })

  const validation = ticketSchema.validate(ticket);
  if (validation.error) return res.status(422).send(validation.error.details[0].message);

  try {
    await db.collection('tickets').insertOne(ticket)
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(5000, () => {
  console.log('Server is listening on port 5000.');
});

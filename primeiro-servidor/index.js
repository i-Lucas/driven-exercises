import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/hello', (req, res) => {

  res.send("Meu primeiro servidor");
})

app.listen(5000);
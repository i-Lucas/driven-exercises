import express from 'express';

const app = express();
app.listen(5000, () => console.log('Server started on port 5000'));

let tempo = 0;
let intervalo = null;

app.get("/iniciar", (req, res) => {

    intervalo = setInterval(() => {
        tempo ++;
    }, 1000)

    res.send("Cronômetro iniciado");
});

app.get("/parar", (req, res) => {

    clearInterval(intervalo);
    res.send({ "tempo:": `${tempo}`});
    tempo = 0;
})
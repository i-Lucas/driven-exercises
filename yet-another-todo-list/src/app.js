import express, { json } from 'express';

const app = express();
app.use(json());

const tasks = [];


app.post("/task", (req, res) => {

    const body = req.body;

    const newTask = {
        description: body.description,
        isChecked: body.isChecked
    };

    tasks = [...tasks, newTask];
    res.send(newTask);
})

app.get("/tasks", (req, res) => {

    res.send(tasks);
})

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})
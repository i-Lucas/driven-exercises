import express from 'express';

const forecast = [

  { day: 1, temperature: "32 °C", wind: "8 km/h", views: 0 },
  { day: 2, temperature: "27 °C", wind: "9 km/h", views: 0 },
  { day: 3, temperature: "30 °C", wind: "8 km/h", views: 0 },
  { day: 4, temperature: "32 °C", wind: "7 km/h", views: 0 },
  { day: 5, temperature: "31 °C", wind: "8 km/h", views: 0 },
  { day: 6, temperature: "26 °C", wind: "10 km/h", views: 0 },
  { day: 7, temperature: "27 °C", wind: "9 km/h", views: 0 }
];

const app = express();
app.listen(5000, () => console.log('Server started on port 5000'));

app.get("/forecast", (req, res) => {

  forecast.forEach(day => {
    day.views++;
  })

  res.send(forecast)

})

app.get("/forecast/:day", (req, res) => {

  let { day } = req.params;
  day = parseInt(day);
  forecast[day - 1].views += 1;
  res.send(forecast[day]);
});






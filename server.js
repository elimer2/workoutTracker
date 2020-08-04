const express = require("express");
const logger = require("morgan");
const path = require("path");
let mongoose = require("mongoose");
let db = require("./models");

mongoose.connect("mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false,
});

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/stats.html"));
});

app.get("/api/workouts", (req, res) => {
  db.Workout.find({})
    .then((dbWorkout) => {
      console.log("im in api/workout", dbWorkout);
      res.json(dbWorkout);
    })
    .catch((err) => {
      console.log("im in error api/workout", err);
      res.json(err);
    });
});

app.put("/api/workouts/:id", (req, res) => {
  db.Workout.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { exercises: req.body } },
    { new: true }
  )
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.post("/api/workouts", (req, res) => {
  db.Workout.create({ day: new Date().setDate(new Date().getDate()) })
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

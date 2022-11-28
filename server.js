const express = require("express");
const db = require("./db/connection");
const apiRoutes = require("./routes/apiRoutes");
const { initializeApp } = require("./lib/App");

const PORT = process.env.PORT || 3001;
const app = express();

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// using routes
app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).end();
});

// database connection
db.connect((err) => {
  if (err) throw err;

  app.listen(PORT, () => {});
});

// call init app function
initializeApp();

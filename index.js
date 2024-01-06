const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const jwt = require('jsonwebtoken');
const { register, login } = require("./controllers/userController");
const { addURL, redirectURL, analyseURL } = require("./controllers/urlController");
require("dotenv").config();
const path = require('path');


const app = express();
const PORT = process.env.PORT;

const cors = require("cors");

app.use(cors({ credentials: true }));

// Set EJS as the view engine and set the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("db connected!");
  })
  .catch((err) => {
    console.log(err.message);
  });

  // Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static('public'));


// Define routes

app.post("/register", register);
app.post("/login", login);
app.post("/create-short-link", addURL);
// app.get('/:shortCode', redirectURL);
app.get("/analysis", analyseURL);

// Home route
app.get("/", (req, res) => {
  if (req.session.user) {
    res.render('home', { username: req.session.user.username });
  } else {
    res.redirect("/login");
  }
});

// Login page 
app.get("/login", (req, res) => {
  res.render('login');
});

// SignUp page
app.get("/signup", (req, res) => {
    res.render('signup');
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

//create-URL page
app.get("/create-url", (req, res) => {
  res.render('createUrl');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

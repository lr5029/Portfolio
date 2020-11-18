/**
 * Ran Liao
 * 11/17/2020
 * AF Wilson Tang
 *
 * This is the app.js file with two endpoint that generate different types of ciphers
 * from user input providing record of users' input and interact with users themselves
 * with greeting or feedback received message
 */
'use strict';
const express = require('express');
const app = express();
const multer = require("multer");
const cors = require('cors');
const ERROR = 400;
const HOST = 8000;

app.use(cors());

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

/**
 * /portfolio/welcome endpoint with route parameter name and required query parameter year.
 * Gets the greeting message with client's specified name and favourite year.
 */
app.get("/portfolio/welcome/:first", function(req, res) {
  let firstName = req.params.first;
  let year = req.query.year;
  res.type('text');
  if (!req.query.year) {
    res.status(ERROR).send("Error: Missing required year query parameters.");
  } else {
    res.send("Welcome to My Page, " + firstName + " from " + year + "!");
  }
});

/**
 * /portfolio/feedback endpoint with POST parameters of `background`, `content`,
 * `layout`, `suggestion` and `idea`.
 * When client's suggestion of the webpage is submitted from the feedback section,
 * format his/her suggestion correspondingly in the form of json and send back to client.
 */
app.post("/portfolio/feedback", (req, res) => {
  let background = req.body.bckgound;
  let content = req.body.content;
  let layout = req.body.layout;
  let suggestion = req.body.suggestion;
  let idea = req.body.idea;
  res.json({
    "Background": background,
    "Content": content,
    "Layout/Color": layout,
    "Suggestion": suggestion,
    "More Ideas": idea
  });
});

app.use(express.static('public'));
const PORT = process.env.PORT || HOST;
app.listen(PORT);


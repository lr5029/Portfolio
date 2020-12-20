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
const multer = require("multer");
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

const DB_NAME = "feedback.db";
const SERVER_ERROR_CODE = 500;
const CLIENT_ERROR_CODE = 400;
const HOST = 8000;
const SERVER_MSG = {"error": "An error occurred on the server. Try again later."};

/**
 * /portfolio/welcome endpoint with route parameter name and required query parameter year.
 * Gets the greeting message with client's specified name and favourite year.
 */
app.get("/portfolio/welcome/:first", function(req, res) {
  let firstName = req.params.first;
  let year = req.query.year;
  res.type('text');
  if (!req.query.year) {
    res.status(CLIENT_ERROR_CODE).send("Error: Missing required year query parameter.");
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
app.post("/portfolio/feedback", async (req, res) => {
  let background = req.body.bckgound;
  let content = req.body.content;
  let layout = req.body.layout;
  let idea = req.body.idea;
  let suggestion = req.body.suggestion;
  let firstName = req.body.name;
  if (!suggestion || !firstName) {
    res.status(CLIENT_ERROR_CODE).json({"error": "Missing required parameters."});
  } else {
    try {
      const db = await getDBConnection();
      let id = await user(firstName);
      let qry = "INSERT INTO feedbacks(user, background, content, layout, suggestion, idea) " +
        "VALUES(?, ?, ?, ?, ?, ?);";
      await db.run(qry, [id, background, content, layout, suggestion, idea]);
      await db.close();
      res.json({
        "Background": background,
        "Content": content,
        "Layout/Color": layout,
        "Suggestion": suggestion,
        "More Ideas": idea
      });
    } catch (err) {
      res.status(SERVER_ERROR_CODE).json(SERVER_MSG);
    }
  }
});

/**
 * used to retrieve user ID for this particular user entered or generate
 * one if not already existed
 * @param {string} name - the player's name
 * @returns {number} - The id for this player
 */
async function user(name) {
  const db = await getDBConnection();
  let qry = "SELECT id FROM users WHERE name=?;";
  let rows = await db.all(qry, [name]);
  let id;
  if (rows.length === 0) {
    qry = "INSERT INTO users(name) VALUES(?);";
    const result = await db.run(qry, [name]);
    id = result.lastID;
  } else {
    id = rows[0].id;
  }
  await db.close();
  return id;
}

/**
 * Establishes a database connection to the wpl database and returns the database object.
 * Any errors that occur during con. should be caught in the function that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: DB_NAME,
    driver: sqlite3.Database
  });
  return db;
}

app.use(express.static('public'));
const PORT = process.env.PORT || HOST;
app.listen(PORT);


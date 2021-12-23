const express = require("express");
const mysql = require("mysql");

const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  database: "nodejs-mysql",
});

// Get all records / beers
app.get("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    // query(sqlString, callback)
    connection.query("SELECT * from beers", (err, rows) => {
      connection.release(); // return the connection pool

      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    });
  });
});

// Get a record / beer by ID
app.get("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    // query(sqlString, callback)
    connection.query(
      "SELECT * from beers where id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release(); // return the connection pool

        if (!err) {
          res.send(rows);
        } else {
          console.log(err);
        }
      }
    );
  });
});

// Add a record / beer
app.post("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    const params = req.body;

    // query(sqlString, callback)
    connection.query("INSERT INTO beers SET ?", params, (err, rows) => {
      connection.release(); // return the connection pool

      if (!err) {
        res.status(200).json({
          success: true,
          message: "Beer has been added",
          beer: params,
        });
      } else {
        console.log(err);
      }
    });
  });
});

// Update a record / beer by ID
app.put("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    const id = req.params.id;
    const { name, tagline, description, image } = req.body;

    // query(sqlString, callback)
    connection.query(
      "UPDATE beers SET name = ?, tagline = ? WHERE id = ?",
      [name, tagline, id],
      (err, rows) => {
        connection.release(); // return the connection pool

        if (!err) {
          res.status(200).json({
            success: true,
            message: "Beer has been updated",
          });
        } else {
          console.log(err);
        }
      }
    );
  });
});

// Delete a record / beer by ID
app.delete("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    // query(sqlString, callback)
    connection.query(
      "DELETE from beers where id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release(); // return the connection pool

        if (!err) {
          res.send(
            `Beer with the Record ID: ${req.params.id} has been removed.`
          );
        } else {
          console.log(err);
        }
      }
    );
  });
});

app.listen(port, () => console.log(`Listening on PORT ${port}...`));

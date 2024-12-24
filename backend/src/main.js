require("dotenv").config();
const express = require('express');
const cors = require('cors');
const Database = require("./db");

// Connect to the database
Database.Connect();

// Create the react app
const app = express();
app.use(cors());

// Get all of the levels (in order)
app.get("/get-levels", async (req, res) => {
    const result = await Database.Query("SELECT name, level_index FROM `levels` ORDER BY level_index ASC");
    res.json(result);
    res.status(200);
});

// Get all of the sections in a level
app.get("/get-sections", async (req, res) => {
    const level = req.query.level;
    const result = await Database.Query("SELECT type, section_index, algorithm_id FROM `sections` WHERE level_id=? ORDER BY section_index ASC", [level]);
    res.json(result);
    res.status(200);
})

// Listen on port 3000
app.listen(3001);

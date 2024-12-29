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
    const sectionData = await Database.Query("SELECT type, section_index, algorithm_id FROM `sections` WHERE level_id=? ORDER BY section_index ASC", [level]);
    try {
        let result = await Promise.all(sectionData.map(async section => {
            let sortData = await Database.Query("SELECT name, space_complexity, time_complexity, implementation FROM `algorithms` WHERE id=?", [section.algorithm_id]);
            if (!sortData.length) {
                throw "Cannot find sorting algorithm with id " + section.algorithm_id;
            }
            sortData = sortData[0];
            const explanation = await Database.Query("SELECT description FROM `explanations` WHERE type=? AND sort_id=?", [section.type, section.algorithm_id]);
            if (!explanation.length) {
                throw "Cannot find explanation for " + section.type + " with sort of id " + sortData.id;
            }
            return {
                index: section.section_index,
                type: section.type,
                sort: {
                    name: sortData.name,
                    space: sortData.space_complexity,
                    time: sortData.time_complexity,
                    implementation: sortData.implementation
                },
                description: explanation[0].description
            }
        }));

        res.json(result);
        res.status(200);
    } catch (err) {
        res.json(err);
        res.status(500);
    }
});

// Listen on port 3000
app.listen(3001);

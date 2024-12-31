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
    const sectionData = await Database.Query("SELECT type, time_limit, required, section_index, sort_ids FROM `sections` WHERE level_id=? ORDER BY section_index ASC", [level]);
    let result = sectionData.map(section => {
        return {
            index: section.section_index,
            type: section.type,
            limit: section.time_limit,
            required: section.required,
            ids: section.sort_ids
        }
    });

    res.json(result);
    res.status(200);
});



// Get 4 random sorting algorithms - one of them being 'correct'
async function generateMultipleChoice(req) {
    let include = req.query.include.split(",");
    include = include[Math.floor(Math.random() * include.length)];
    const result = await Database.Query("SELECT id, name FROM algorithms WHERE id = ? UNION ALL SELECT id, name FROM algorithms WHERE id != ? LIMIT 4;", [include, include]);
    
    for (let i = result.length - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    let index = 0;
    let finalId = 0;

    let final = result.map((a, i)=>{
        if (a.id == include) {
            index = i;
            finalId = a.id;
        }
        return {
            name: a.name
        };
    });

    return [[final, index], finalId];
}

app.get("/get-random-question", async (req, res) => {
    let result;
    switch(req.query.type) {
        case "algo_sound":
            result = await generateMultipleChoice(req);
            break;
        default:
            res.send({
                type: "error",
                message: "Cannot find game " + req.query.type
            }).status(500);
    }
    res.send(result);
    res.status(200);
});

// Get information about a sorting algorithm
app.get("/get-sort-data", async (req, res) => {
    const sort_id = req.query.id;
    const game_type = req.query.type;
    if (!sort_id || !game_type) return void res.json({type: "error"}).status(500);
    const result = await Database.Query("SELECT implementation, time_complexity, space_complexity, name FROM `algorithms` WHERE id=?", [sort_id]);
    const explanation = await Database.Query("SELECT description from `explanations` WHERE type=? AND sort_id=?", [game_type, sort_id]);
    res.send({
        implementation: result[0]?.implementation,
        space: result[0]?.space_complexity,
        time: result[0]?.time_complexity,
        description: explanation[0]?.description || "Could not find explanation",
        name: result[0]?.name
    });
    res.status(200);
});

// Listen on port 3000
app.listen(3001);

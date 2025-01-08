require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const Database = require("./db");
const userRoutes = require("./auth/userRoutes");
const https = require("https");
const fs = require("fs");
const questionRoutes = require("./questions/questionRoutes");

// Connect to the database
Database.Connect();

// Create the react app
const app = express();
app.use(cors({
    origin: 'https://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(cors({
    origin: 'https://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(cookieSession({
    secret: process.env.SECRET_KEY,
    cookie: {
        httpOnly: true,
        expires: false
    },
    saveUninitialized: true
}));
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());

app.use('/user', userRoutes);
app.use("/question", questionRoutes);

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

// Listen on port 3001 with a certificate
https.createServer({
    key: fs.readFileSync('../frontend/cert.key'),
    cert: fs.readFileSync('../frontend/cert.crt')
}, app).listen(3001);


/*
Data in the form
{
    lastLevel: INTEGER,     // The last level you completed
    seen: [INTEGER]         // ID of the explanations you have seen
}
*/

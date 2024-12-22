const express = require('express');

// Create the react app
const app = express();

// Handle get requests to test
app.get("/test", (req, res) => {
    res.send("Hello world!");
});

// Listen on port 3000
app.listen(3001);

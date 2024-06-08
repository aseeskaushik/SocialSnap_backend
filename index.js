const express = require('express');
const cors = require('cors');
const dB = require("./config/mongoose");
const fileUpload = require("express-fileupload");
require('dotenv').config();

const app = express();
const port = process.env.PORT;
dB();

// Specify CORS options to allow access only from 'http://localhost:5173'
const corsOptions = {
    origin: 'http://localhost:5173',
};

app.use(cors(corsOptions)); // Use CORS middleware with custom options
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use file upload middleware after body parsing middleware
app.use(fileUpload({ limits: { fileSize: 100 * 1024 * 1024 } }));

// Routes
app.use('/', require("./routes"));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

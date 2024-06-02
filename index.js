const express = require('express');
const cors = require('cors');
const dB = require("./config/mongoose");
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
app.use('/', require("./routes"));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

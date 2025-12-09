const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Middlewares
const authjwt = require("./middlewares/jwt");
const errorHandler = require("./middlewares/error_handler");

// Routes
const auth = require("./routes/auth");
const products = require("./routes/products");

// MongoDB
const mongoose = require('mongoose');

const app = express();

// ==================== Middleware ====================
app.use(express.json());   // body parser
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(cors());

app.use(authjwt());       // use JWT middleware
app.use(errorHandler);  // use error handler middleware
console.log("bashar")
// ==================== Environment ====================
const env = process.env;
const port = env.PORT;
const hostname = env.HOST;
const api = env.API_URL;

// ==================== Routes ====================
app.use(`${api}/`, auth);
app.use("/products", products);

// ==================== MongoDB Connection ====================
const url = process.env.MONOGO_URL;
mongoose.connect(url)
    .then(() => console.log("Connected to database successfully"))
    .catch(err => console.log(err));

// ==================== Server ====================
app.listen(port, () => {
    console.log('Server is running on port', port);
});

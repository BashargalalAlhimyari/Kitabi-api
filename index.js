const express = require("express")
const app = express()
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
app.use(express.json())   // its like app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())

app.use(express.urlencoded({ extended: true }));



//============== ENVIRONMENT VARIABLES ===============
const env = process.env;
const port = env.PORT;
const hostname = env.HOST;
const api = env.API_URL;
//============== ENVIRONMENT VARIABLES ===============

 
//============== ROUTES ===============
const auth = require("./routes/auth")
const products = require("./routes/products")

app.use(`${api}/`, auth)
app.use("/products", products)
//============== ROUTES ===============


// ==============  MONOGO CNNECTION ===============
const { MongoClient } = require('mongodb')
const mongoose = require('mongoose')
 
const url = process.env.MONOGO_URL
mongoose.connect(url).then(() => {
    console.log("connected to database successfully")
}).catch((err) => {
    console.log(err)
})
// ==============  MONOGO CNNECTION ===============
    


app.listen(port, () => {
    console.log('Server is running on port', port)
})


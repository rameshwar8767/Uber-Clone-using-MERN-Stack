const dotenv = require('dotenv')
dotenv.config();
const cors = require('cors');
const express = require("express")
const connectDb = require('./db/db.js')
const app = express()
const userRoutes = require('./routes/user.routes.js')
const cookieParser = require('cookie-parser')
const captainRoutes = require('./routes/captain.routes.js')
app.use(cors());
app.use(cookieParser())
connectDb()



app.get('/', (req,res)=>{
    res.send("Hello World")
})
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/users', userRoutes)

app.use('/captains', captainRoutes)



module.exports= app;

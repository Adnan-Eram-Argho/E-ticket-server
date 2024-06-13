require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors')
const userhandler  = require("./routeHandler/userHandler")
const eventHandler  = require("./routeHandler/eventHandler")
const app = express();
app.use(cors());
app.use(bodyParser.json());



const port = 5000;
const uri = process.env.MONGO_URI;

//database connection with mongoose
mongoose.connect(uri)
.then(()=>console.log("connection successfull"))
.catch(err=>console.log(err))
//error handling
const errorHandler= (err,req,res,next)=>{
    if(res.headersSent){
    return next(err)
    }
    res.status(500).json({error:err});
}
app.use(errorHandler)
//application routes
app.use("/user",userhandler);
app.use("/event",eventHandler);



app.get('/', (req, res) => {
    res.send(" route is working")
})

app.listen(port, (req, res) => {
    console.log("app is listening on port :", port)
})








// npm install express mongoose bcryptjs jsonwebtoken dotenv body-parser cors
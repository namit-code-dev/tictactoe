const express=require("express")
const app=express()
const port=process.env.PORT || 3000;
const {dbconnect}=require("./controller/control")
const middlewares = require("./middleware/middleware")
const dotenv =require("dotenv")
dotenv.config()

//database connect
dbconnect(process.env.mongodb)

//middleware
middlewares(app)

//view engine
app.set("view engine", "ejs")
app.set('views', __dirname + '/views');

app.get("/login",(req,res)=>{
    res.render("login")
})

//app listen
app.listen(port,()=> console.log(`Server started on http://localhost:${port}`))
const router = require("../routes/routes");
const router_login=require("../routes/login")
const cookieParser = require("cookie-parser");
const cors=require("cors")
const express=require("express");


const middlewares = (app)=>{
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/signup",router)
app.use(cookieParser())
app.use("/login",router_login)
}
module.exports=middlewares
const router = require("../routes/routes");
const router_login=require("../routes/login")
const htmlroute=require("../routes/htmlroute")
const cookieParser = require("cookie-parser");
const cors=require("cors")
const express=require("express");
const path = require("path");


const middlewares = (app)=>{
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/signup",router)
app.use(cookieParser())
app.use("/login",router_login)
app.use("/index.html",htmlroute)
app.use(express.static(path.join(__dirname, "../../docs"), {
  index: false
}));
}
module.exports=middlewares
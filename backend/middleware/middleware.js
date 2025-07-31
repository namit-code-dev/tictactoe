const router = require("../routes/routes");
const router_login=require("../routes/login")
const htmlroute=require("../routes/htmlroute")
const gameoption_routes=require("../routes/gameoption_routes")
const cookieParser = require("cookie-parser");
const cors=require("cors")
const express=require("express");
const path = require("path");
const {handleindexhtml}=require("../controller/control")

const middlewares = (app)=>{
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/signup",router)
app.use(cookieParser())
app.use("/login",router_login)
app.use("/namitgame",htmlroute)
app.use("/img", express.static(path.join(__dirname, "../../docs/images_ejs")))
app.use("/namitgame",handleindexhtml,express.static(path.join(__dirname, "../../docs")));
app.use("/gameoption",gameoption_routes)

}
module.exports=middlewares
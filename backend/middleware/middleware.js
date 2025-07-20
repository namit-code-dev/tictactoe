const router = require("../routes/routes");
const cors=require("cors")
const express=require("express")

const middlewares = (app)=>{
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/signup",router)
}
module.exports=middlewares
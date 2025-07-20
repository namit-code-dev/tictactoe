const express =require("express")
const {handlersingup_user, dbconnect}=require("../controller/control")
const router=express.Router()

const signup =router.post("/",handlersingup_user)
module.exports={signup}
const express =require("express")
const {handlelogin}=require("../controller/control")
const router=express.Router()

router.post("/",handlelogin)


module.exports=router
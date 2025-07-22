const express =require("express")
const router=express.Router()
const {handleindexhtml}=require("../controller/control")
router.get("/",handleindexhtml)


module.exports=router
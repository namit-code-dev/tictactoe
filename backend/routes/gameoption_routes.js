const express=require("express")
const {handlegameoption}=require("../controller/gameoption")
const router=express.Router()
router.get("/",handlegameoption)

module.exports=router
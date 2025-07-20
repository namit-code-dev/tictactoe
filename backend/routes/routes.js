const express =require("express")
const {handlersingup_user, handlersignup_ejs}=require("../controller/control")
const router=express.Router()

router.get("/",handlersignup_ejs)
router.post("/",handlersingup_user)
module.exports=router
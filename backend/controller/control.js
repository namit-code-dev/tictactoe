const mongoose  = require("mongoose")
const model=require("../model/model")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

async function dbconnect(url){
   const connect =await mongoose.connect(url)
   if(connect){
     console.log("✅ MongoDB connected");
   }
   else{
     console.log("not connected");
   }
}


async function handlersingup_user(req,res){
 const{fullname,email,age,password}=req.body
       const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    console.log(hash)    
   const usercreate= await model.create({
        fullname,
        email,
        age,
        password:hash
    })
res.send("done")
if(!usercreate){
  alert("something went wrong")
}
console.log(usercreate);   
}



async function handlersignup_ejs(req,res) {
    res.render("login")  
}
module.exports={handlersingup_user,dbconnect,handlersignup_ejs}

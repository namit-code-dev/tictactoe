const mongoose  = require("mongoose")
const model=require("../model/model")

async function dbconnect(url){
   const connect =await mongoose.connect(url)
   if(connect){
     console.log("✅ MongoDB connected");
   }
}


async function handlersingup_user(req,res) {
    const{fullname,email,age,password}=req.body
   const usercreate= await model.create({
        fullname,
        email,
        age,
        password
    })
res.send("done")
console.log(req.body);
}
module.exports={handlersingup_user,dbconnect}

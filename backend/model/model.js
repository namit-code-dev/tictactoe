const mongoose=require("mongoose")

const schema=mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
         type:String,
        required:true,
        unique:true
    },
    age:{
         type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
})

const model=mongoose.model("singup-user",schema)

module.exports=model
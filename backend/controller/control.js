const mongoose = require("mongoose")
const model = require("../model/model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



async function dbconnect(url) {
  const connect = await mongoose.connect(url)
  if (connect) {
    console.log("✅ MongoDB connected");
  }
  else {
    console.log("not connected");
  }
}

async function handlersingup_user(req, res) {

  const { fullname, email, age, password } = req.body
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const usercreate = await model.create({
    fullname,
    email,
    age,
    password: hash
  })
  res.send("done")
  if (!usercreate) {
    res.status(404).send("something went wrong")
  }
}


async function handlelogin(req, res) {
  try {
    const  findemail= req.body.email
    const  password=req.body.password
    const finddb = await model.find({ email: findemail });
    if (finddb.length === 0) {
  return res.status(404).json({ message: "User not found" });
}
  
  
      bcrypt.compare(password,process.env.hidden_bcrypt_pass, function(err, result) {
    console.log(result)
});
      const token = jwt.sign(findemail, process.env.hidden_bcrypt_pass)
      res.cookie("cookies", token)
      res.send("cookie set");
      console.log(req.cookies);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


async function handlersignup_ejs(req, res) {
  res.render("signup")
}
module.exports = { handlersingup_user, dbconnect, handlersignup_ejs, handlelogin }


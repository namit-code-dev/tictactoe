const mongoose = require("mongoose")
const model = require("../model/model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const path = require("path");


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
  try{
  const usercreate = await model.create({
    fullname,
    email,
    age,
    password: hash
  })
  res.send("/login")}
  catch(err){
   if (err.code==11000) {
    res.send("<h1>It Seems You Have An Account With This email</h1>")
   }
  }
  if (!usercreate) {
    res.status(404).send("something went wrong")
  }
}



async function handlelogin(req, res) {
  try {
    const findemail = req.body.email
    const password = req.body.password
    const finddb = await model.findOne({ email: findemail });
    if (!finddb) {
      return res.status(404).send("<h1>SOMETHING WENT WRONG</h1>");
    }
    bcrypt.compare(password, finddb.password, function (err, result) {
      if (result) {
        const token = jwt.sign(findemail, process.env.hidden_bcrypt_pass)
        res.cookie("cookies", token)
        return res.redirect("/namitgame");
      }

      else {
        res.send("<h1>SOMETHING WENT WRONG</h1>");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


async function handleindexhtml(req, res, next) {
  const cookie = req.cookies.cookies

  if (!cookie) {
    return res.send("<h1>ACCESS DENIED</h1>");
  }
  try {
    const token_verify = jwt.verify(cookie, process.env.hidden_bcrypt_pass)
    if (token_verify) {
      return next()

    }
    else {
      console.log(false)
      return res.send("<h1>ACCESS DENIED</h1>");
    }
  }
  catch (err) {
    console.log(err)
  }

}


async function handlersignup_ejs(req, res) {
  res.render("signup")
}
module.exports = { handlersingup_user, dbconnect, handlersignup_ejs, handlelogin, handleindexhtml }



var express = require('express');
var router = express.Router();
const userModel=require("./users");
const passport = require('passport');

const localStrategy =require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res) {
  res.render("index");
});

//create
router.get("/create", async function(req, res) {
  const createduser=await userModel.create({
    username:"harsh",
    name:"harshit",
    age:12
  });
  res.send(createduser);
});

//read
router.get("/read",async function(req, res){
  let readuser=await userModel.find();
  res.send(readuser);
});

//findone
router.get("/read",async function(req, res){
  let readuser=await userModel.findOne({username:"harsh"});
  res.send(readuser);
});

//delete
router.get("/delete",async function(req, res){
  let deleteduser=await userModel.findOneAndDelete({username:"harsh"});
  res.send(deleteduser);
});

//sessiion set and check
router.get('/',function(req, res){
  req.session.ban=true;
  res.render("index");
});

router.get("/checkban", function(req,res){
  if(req.session.ban===true){
    res.send("you are banned");
  }else{
    res.send("not banned");
  }});

//session delete
router.get("/removeban", function(req,res){
  req.session.destroy(function(err){
    if(err) throw err;
    res.send("ban removed");
  });
});

//cookie

//cookie set
router.get("/",function(req,res){
  res.cookie("age",23);
  res.render("index");
});
router.get("/readcookie", function(req, res){
  console.log(req.cookies);
  res.send("check");
});

// //deletecookie
router.get("/deletecookie", function(req, res){
  res.clearCookie("age");
  res.send("clear ho gyya");
})

//connection-flash
router.get("/failed", function(req, res){
  req.flash("age", 12);
  res.send("bngyya");
})
router.get("/checkkaro", function(req, res){
 console.log(req.flash("age"))
  res.send("terminal dekho");
})

router.get("/create", async function(req,res){
  let userdata =await userModel.create({
    username: "harshita",
    nickname: "har",
    description: "k likhna  ",
    categories: ['js', 'react'],
  });
  res.send(userdata);
})

//insensitive case- using regexp
router.get('/find',async function(req,res){
  var regex=new RegExp("^Harshita$", "i");
  let read=await userModel.find({username:regex});
  res.send(read);
})

//find doc with all set of value
router.get('/find',async function(req,res){
 let read=await userModel.find({categories:{$all: ["react","js"]}});
  res.send(read);
})

//search for doc with specific range of date
router.get('/find',async function(req,res){
  var date1=new Date('2024-08-07');
  var date2=new Date('2024-08-08');
 let read=await userModel.find({datecreated: { $gte:date1,$lte:date2}});
  res.send(read);
})

//find based on existence of field
router.get('/find',async function(req, res) {
  let user=await userModel.find({categories:{$exists: true}})
  res.send(user);
});

//find on specific field length
router.get('/find', async function(req, res) {
 let user= await userModel.find({
  $expr:{
    $and:[
      {$gte:[{$strLenCP:'nickname'},5]},
      {$lte:[{$strLenCP: 'nickname'},9]}
    ]
  }
 })
 res.send(user);
});

//Register and login page (Authentication and Authorization)
router.post('/register', function(req,res){
  var userdata =new userModel({
    username:req.body.username,
    secret: req.body.secret
  });
  userModel.register(userdata, req.body.password)
  .then(function (registereduser){
    passport.authenticate("local")(req,res, function(){
      res.redirect('/profile');
    })
  })
});

router.get('/profile',isLoggedIn, function(req, res) {
  res.render("profile");
});
router.post('/login', passport.authenticate("local", {successRedirect:"/profile",
  failureRedirect:"/"
}),function(req, res) {});

router.get('/logout', function(req, res,next) {
  req.logout(function(err){
    if(err) throw next(err);
    res.redirect("/");
  })
});
function isLoggedIn(req,res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}




module.exports = router;

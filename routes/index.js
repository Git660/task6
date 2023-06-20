var express = require('express');
var router = express.Router();
var usermodel=require('./users');
const passport = require('passport');
const localStrategy=require('passport-local')
const multer=require('multer');
const path = require('path');
passport.use(new localStrategy(usermodel.authenticate()));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  // /images folder conatins the images  of the website 
  // /uploads folder contains the images  uploadded by the users
  filename: function (req, file, cb) {
    var dt= new Date();
    var fn=Math.floor(Math.random()*1000000000)+dt.getTime()+path.extname(file.originalname);
    cb(null,fn)
    
  }
})

const upload = multer({ storage: storage })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',);
});
router.get("/feed",isloggedin,function(req,res,next){
  usermodel.find().then(function(allusers){
    res.render("fee",{allusers})
  })
})

router.get('/profile',isloggedin,function(req, res, next) {
  usermodel.findOne({username:req.session.passport.user}).then(function(bhsdka){
    res.render("profile",{user:bhsdka})
  })
});

router.get("/like/:id",isloggedin,function(req,res,next){
  usermodel.findOne({_id:req.params.id}).then(function(user){
    var indexjisprmila = user.like.indexOf(req.session.passport.user)
    if(indexjisprmila === -1)
    {
      user.like.push(req.session.passport.user)
    }
    else{
      user.like.splice(indexjisprmila,1)
    }
    user.save().then( function(){
      res.redirect("back")
    })
  })
})



router.post("/register",function(req,res,next){
  var createduser= new usermodel({
    username:req.body.username,
    email:req.body.email,
    number:req.body.number,
    // profilepic:req.body.profilepic
  })
  usermodel.register(createduser,req.body.password).then(function(registerduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
})
router.post("/upload",isloggedin,upload.single("image"),function(req,res){

  usermodel.findOne({username:req.session.passport.user}).then(function(loggedinuser){
    console.log(req.files)
    loggedinuser.profilepic=req.file.filename;
    loggedinuser.save();
  }).then(function(imageuploaded){
    res.redirect("back")
  })
})

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"
}),function(req,res){})


router.get("/logout",function(req,res,next){
  req.logout( function(err) {
    if (err) { return next(err); }
    else{
      res.redirect("/")
    }
  })})
  function isloggedin(req,res,next){
    if(req.isAuthenticated()){
      next()
    }
    else res.redirect("/")
  }































module.exports = router;

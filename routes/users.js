const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controller/users.js"); 

//signup user get signup form//signup post request

router
.route("/signup")
.get(userController.rendersignup)
.post(userController.signup);



//login User
router
    .route("/login")
    .get(userController.renderlogin)
    .post(saveRedirectUrl,
           passport.authenticate(
            "local", {
            failureRedirect:"/login",
            failureFlash:true}),
            userController.login
        );
    
//logout User

router.get("/logout",userController.logout);


module.exports=router;
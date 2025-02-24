if(process.env.NNODE_ENV !="production"){
require('dotenv').config();
}


const  express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
//const wrapAsycn=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const mongoStore=require("connect-flash");
const flash=require("connect-flash");
//User
const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;
const user=require("./models/user.js")

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/users.js");
const MongoStore = require('connect-mongo');


const dbUrl=process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});


async function main(){
    await  mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,

});

store.on("error",()=>{
    console.log("Error in MONGO SESSEION STORE",err)
});


const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

/*app.get("/",(req,res)=>{
    res.send("Hi ,I am root");
});*/


app.use(session(sessionOptions));
app.use(flash());

//code for user
app.use(passport.initialize());//middleware that initialized passport
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});




  app.use("/listings",listingsRouter);
  app.use("/listings/:id/reviews",reviewsRouter);
  app.use("/",userRouter);




app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong! "}=err;
    res.render("error.ejs",{err});
   res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    
    console.log("server is listening to port 8080");
});
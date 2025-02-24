const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const {reviewSchema}=require("./schema.js")
const {listingSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be login!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.validateListing=(req,res,next)=>{
  let{error}= listingSchema.validate(req.body);
    console.log(error);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};
  
module.exports.validateReview=(req,res,next)=>{
  let{error}= reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

module.exports.isReviewAuthor=(async (req,res,next)=>{
  let {id,reviewid}=req.params;
    let review= await Review.findById(reviewid);
    if(!review.author._id.equals(res.locals.currUser._id))
    {
      req.flash("error","Your not hte author of this review!");
      return res.redirect(`/listings/${id}`);

    }
    next();
});






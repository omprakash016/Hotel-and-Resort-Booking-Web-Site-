const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {reviewSchema}=require("../schema.js");

module.exports.createReview=async(req,res,next)=>{
    try{
    let {id }=req.params;
    let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","New Review Posted!");
    console.log("new review saved");
    res.redirect(`/listings/${id}`);
    
    }
    catch(err){
        next(err);
    }

};


module.exports.destroyReview=async(req,res,next)=>{
    try{
    let{ id , reviewId }=req.params;

    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
    }catch(err){
        next(err);
    }
};
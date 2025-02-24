const express=require("express");
const router=express.Router({mergeParams: true});
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

const ExpressError=require("../utils/ExpressError.js");
const{validateReview,isLoggedIn,isReviewAuthor,}=require("../middleware.js");

const reviewController=require("../controller/reviews.js");


//Reviews Post route

router.post(
    "/",
    isLoggedIn,
    validateReview,
    reviewController.createReview
    );

//Delete rout of reviews
router.delete(
    "/:reviewId",
    isLoggedIn,
   // isReviewAuthor,
    reviewController.destroyReview
    );

module.exports=router;
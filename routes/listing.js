const express=require("express");
const router=express.Router();
//const {listingSchema}=require("../schema.js");
//const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../isLogged.js");
//const{storage}=require("../cloudeconf.js");
//const upload=multer({dest:'uploads/'});
const listingController=require("../controller/listings.js");
const multer=require('multer');
const {storage}=require("../cloudeconf.js");
const upload=multer({storage});

  

//index Route nad create Route
router
  .route("/")
  .get(listingController.index)
  .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        listingController.createListing
      );
  

//New Route
  router.get("/new",
        isLoggedIn,
        listingController.renderNewForm
      );
 
  
// show route ,Update & delete route
router.route("/:id")
  .get(listingController.showListing)
  .put(
      isLoggedIn,
      upload.single('listing[image]'),
      validateListing,
      listingController.updateListing
     )
  .delete(
      isLoggedIn,
      listingController.deleteListing
    ); 

  
  //Edit ROute
  router.get("/:id/edit",isLoggedIn,listingController.editListing);
  
  
  module.exports=router;
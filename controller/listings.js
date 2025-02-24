const Listing=require("../models/listing");


module.exports.index=async (req,res,)=>{
    const allListings= await  Listing.find({});
    res.render("listings/index.ejs",{allListings});
  };

  module.exports.renderNewForm=(req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
  }

  module.exports.showListing=async(req,res,next)=>{
    try{
    let {id}= req.params;
   const listing= await Listing.findById(id)
   .populate({
      path:"reviews",
      populate:{
           path:"author",
              },
      })
      .populate("owner");
   if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listing");
   }
   res.render("listings/show.ejs",{listing});

    }
    catch(err){
        next(err);

    }
};

module.exports.createListing=async(req,res,next)=>{ 
          try{
            let url=req.file.path;
            let filename=req.file.filename;
           const newListing=new Listing(req.body.listing);
            newListing.owner=req.user._id;
            newListing.image={url,filename};
            await newListing.save();
              req.flash("success","New Listing Created!");  
              res.redirect("/listings");
      }catch(err){
        console.error("Error in POST / route:", err.message);
        next(err);
      }
  };

  module.exports.editListing=async (req,res,next)=>{
    try{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing your requested for doews not exist!");
     res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_200,w_200");
    res.render("listings/edit.ejs",{listing , originalImageUrl});
  }
    catch(err){
        next(err);
    }

};

module.exports.updateListing=async (req,res,next)=>{
      try{
      let {id}=req.params;
      let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
      if(typeof req.file!=="undefined") {
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
      }
      req.flash("success"," Listing is Updated!");
      res.redirect(`/listings/${id}`);
      }
      catch(err){
          next(err);
      }
  };

module.exports.deleteListing=async(req,res,next)=>{
      try{
      let {id}=req.params;
      let deletedListing=await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      req.flash("success","Listing was deleted");
      res.redirect("/listings");
      }
      catch(err){
          next(err);
      }
  };


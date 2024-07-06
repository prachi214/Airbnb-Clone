// for access listing from db
const Listing = require("./models/listing");
const Review = require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

// direct home page se login krne pr this middleware doesn't login

module.exports.isLoggedIn = (req, res , next) =>{
        // authenticate user before allowing to create new listing on website
   if (!req.isAuthenticated()) {

    // when user not logged 
//     redirectUrl save
req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to create listing");
    
   return  res.redirect("/login");
    
   } 
//    if user authenticate h
next();
}

// for originalUrl save krane ke liye

module.exports.saveRedirectUrl = (req, res, next) =>{
        if (req.session.redirectUrl) {
           res.locals.redirectUrl = req.session.redirectUrl;     
                
        }
        next();

}

// middleware for authorization

// checks curruser is eithier listing owner or not

module.exports.isOwner = async(req, res, next) =>{
        let {id} = req.params;
       let listing =  await Listing.findById(id);

if(!listing.owner.equals(res.locals.currUser._id)){

    // when current user not equals to listing owner

    req.flash("error", "Your are not the owner of this listing");
    // if return ni likte to below operations bhi perform ho jayge

  return res.redirect(`/listings/${id}`);
} 
next();
}

module.exports.validateListing = (req,res,next) =>{

        let {error} = listingSchema.validate(req.body);
        // // if result m error
    
        if (error) {
            // err ki propertirs access krna
            let errMsg = error.details.map((ele) =>
                ele.message).join(",");
            
            // joy result ka error show kr rha h
                 throw new ExpressError(400, errMsg);
        }
        else{
            next();
        }
    }

    module.exports.validateReview = (req,res,next) =>{

        let {error} = reviewSchema.validate(req.body);
    
    
        if (error) {
            // err ki propertirs access krna
            let errMsg = error.details.map((ele) =>
                ele.message).join(",");
            
            // joy result ka error show kr rha h
                 throw new ExpressError(400, errMsg);
        }
        else{
            next();
        }
    }

    // review only uske author ke through delete ho only

    module.exports.isReviewAuthor = async(req, res, next) =>{
        let {id, reviewId} = req.params;
       let review =  await Review.findById(reviewId);
if(!review.author.equals(res.locals.currUser._id)){

    // when current user not equals to listing owner

    req.flash("error", "Your are not the author of this review");
    // if return ni likte to below operations bhi perform ho jayge
  return res.redirect(`/listings/${id}`);
} 
next();
}
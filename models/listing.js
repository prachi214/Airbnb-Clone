const mongoose = require("mongoose");
const review = require("./review");
const { ref } = require("joi");
const Schema = mongoose.Schema;
const Review = require("./review");
const listingSchema = new Schema({

    title:{
        type: String,
        required : true,
    } ,

    description: String,


image:{

url: String,
filename: String,

},
category:String,





    price: Number,
    location: String,
    country: String ,
    reviews: [
        {
            // single listing m many reviews, reviews ki id store karayge like customer , order bale m kiye the

            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    // associate with each listing,owner refers listing user or merely for registered use
    
    owner:{
type: Schema.Types.ObjectId,
ref: "User",
    },
    category: {
        type: String,
        enum: ["mountain", "arctic", "farms", "deserts", "boats", "domes", "camping", "amazing pools", "iconic cities", "rooms", "trending"],
    },
});

// mongoose middleware

listingSchema.post("findOneAndDelete", async(listing)=>{

    // un reviews ko delete krna h jo listing ke arr m h
// review ki id listing ki id h to bo sare review ids listing se delete ho jaygi
if (listing) {
    await Review.deleteMany({_id: {$in: listing.reviews}});
}
  
});

// create model or collection
const  Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
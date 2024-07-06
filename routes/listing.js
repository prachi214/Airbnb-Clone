const express  = require("express");

const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
// we  want file cloudinary m store ho
const {storage} = require("../cloudConfig.js");
const { get } = require("mongoose");
// ye multer default kr rha 
// const upload = multer({ dest: 'uploads/'});
// now multer files ko cloudinary m store karayga
const upload = multer({ storage});

// same path ko combine kiya

router.route("/")
.get(wrapAsync(listingController.index))

.post(isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

router.route("/category/:category")
.get(wrapAsync(listingController.choosecategory))


router.route("/search")
.get(wrapAsync(listingController.searchCategory))

// New Route

router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn,isOwner,
    
    upload.single('listing[image]'),
     validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));
module.exports = router;
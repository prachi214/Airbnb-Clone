const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })

}

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");
}

module.exports.showListings = async (req, res) => {

    let { id } = req.params
    const listing = await Listing.findById(id)
        .populate({

            path: "reviews",
            populate: {

                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}

module.exports.choosecategory = async (req, res) => {
    const { category } = req.params;
    const filteredListings = await Listing.find({ category });
    res.render("listings/index", { allListings: filteredListings });
}

module.exports.searchCategory = async (req, res) => {
    const { category } = req.query;
    const filteredListings = await Listing.find({ category: { $regex: category, $options: "i" } });
    res.render("listings/index", { allListings: filteredListings });
}

module.exports.createListing = async (req, res, next) => {

    let url = req.file.path;
    let filename = req.file.filename;


    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    newListing.image = { url, filename };

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New listing created")
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;

    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {

    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        //  upload  image ko listing m show krna cloudinary se
        let url = req.file.path;
        let filename = req.file.filename;
        // then listing m new image add ki 
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}
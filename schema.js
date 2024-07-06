const Joi = require('joi');

// wrt schema which we want to validate
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().allow(''),
        image: Joi.object({
            url: Joi.string().allow(''),
            filename: Joi.string().allow(''),
        }).allow(null),
        category: Joi.string().valid(
            "mountain", "arctic", "farms", "deserts", "boats", "domes", 
            "camping", "amazing pools", "iconic cities", "rooms", "trending"
        ).required(),
        price: Joi.number().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required() 
})
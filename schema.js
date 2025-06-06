const Joi=require("joi");

module.exports.reviewSchema=Joi.object({
  reviews: Joi.object({
    review:Joi.string().required(),
    rating:Joi.number().required(),
  }).required()
})
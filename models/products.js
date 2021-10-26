const Joi = require('joi');

function validateProduct(product) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(40).required(),
        quantity: Joi.number().min(1).required(),
        unit: Joi.string().min(1).max(40).required(),
        price: Joi.number().required(),
        desc: Joi.string().min(150).max(300).required()
    });
    return schema.validate(product);
}

module.exports = validateProduct;
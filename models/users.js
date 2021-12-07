const Joi = require('joi');
const { JoiPassword } = require('joi-password');

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(40).required(),
        email: Joi.string().required().email(),
        password: JoiPassword.string()
            .minOfSpecialCharacters(1)
            .minOfLowercase(1)
            .minOfUppercase(1)
            .minOfNumeric(1)
            .noWhiteSpaces()
            .required(),
        confirm_password: Joi.ref('password')
    });
    return schema.validate(user);
}

module.exports = validateUser;
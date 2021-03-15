const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateLogin(input) {
	let errors = {};
	input.email = !isEmpty(input.email) ? input.email : "";
	input.password = !isEmpty(input.password) ? input.password : "";

	if(validator.isEmpty(input.email) || !validator.isEmail(input.email)) {
		errors.message = "You must enter a valid email.";
	}

	if(validator.isEmpty(input.password)) {
		errors.message = "Please enter a valid password.";
	}

	return {errors, notValid: Object.keys(errors).length ? true:false};
};
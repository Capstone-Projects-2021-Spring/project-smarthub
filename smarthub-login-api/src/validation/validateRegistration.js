const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegistration(input) {
	console.log("IN VALIDATE REGISTRATION");
	let errors = {};
	input.first_name = !isEmpty(input.first_name) ? input.first_name : "";
	input.last_name = !isEmpty(input.last_name) ? input.last_name : "";
	input.email = !isEmpty(input.email) ? input.email : "";
	input.password = !isEmpty(input.password) ? input.password : "";
	input.confirm_password = !isEmpty(input.confirm_password) ? input.confirm_password : "";
	input.phone_number = !isEmpty(input.phone_number) ? input.phone_number.replace(/-/g, "") : "";

	if(validator.isEmpty(input.first_name)) {
		errors.message = "You must enter a first name.";
	}

	if(validator.isEmpty(input.last_name)) {
		errors.message = "You must enter a last name.";
	}

	if(validator.isEmpty(input.email) || !validator.isEmail(input.email)) {
		errors.message = "You must enter a valid email.";
	}

	if(validator.isEmpty(input.password)) {
		errors.message = "You must enter a password.";
	}

	if(validator.isEmpty(input.confirm_password)) {
		errors.message = "You must confirm your password.";
	}

	if(!validator.equals(input.password, input.confirm_password)) {
		errors.message = "Your passwords do not match."
	}

	if(isNaN(input.phone_number)) {
		errors.message = "You phone number should be in the format: 1-215-123-4567."
	}

	if(input.phone_number.length != 11) {
		errors.message = "Phone number length is not correct."
	}

	console.log("OUT VALIDATE REGISTRATION");
	return {errors, notValid: Object.keys(errors).length ? true:false};
};
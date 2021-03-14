const knex = require('./connection');

//Checks database for existing emails.
function getEmail(userEmail) {
    return knex("users").where("user_email", userEmail).returning("*").then((emails) => {
        return emails[0];
    });
}

function getPassword(userEmail) {
    return knex("users").where("user_email", userEmail).returning("*").then((passwords) => {
        return passwords[0].user_password;
    });
}

function register(firstName, lastName, userEmail, userPassword) {
    console.log("In register");
    return knex("users").insert({
        user_first_name: firstName,
        user_last_name: lastName,
        user_email: userEmail,
        user_password: userPassword
    }).returning("*").then((rows) => { return rows[0]; });

}

module.exports = {
    getEmail,
    getPassword,
    register
}
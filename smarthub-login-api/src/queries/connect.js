



//Setting required postgresql connection information from environment variables.


connect = {};

async function addUserQuery(first_name, last_name, email, password) {
    var query = "INSERT INTO users (user_first_name, user_last_name, user_email, user_password) " +
                "VALUES ('" + first_name + "', '" + last_name + "', '" + email + "', '" + password + "')";
    return query;
}

async function getEmail(email) {
    var query = "SELECT user_email FROM users WHERE user_email= '" + email + "'";
    return query;
}

async function getPassword(email) {
    var query = "SELECT user_password FROM users WHERE user_email='" + email + "'";
    return query;
}




module.exports = {
    addUserQuery,
    getEmail,
    getPassword
}
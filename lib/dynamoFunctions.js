let aws = require("aws-sdk");
const uuidv4 = require('uuid/v4');
require('dotenv').config();
const passwordHash = require('password-hash');

aws.config.update({
    region: "us-east-2"
});

const docClient = new aws.DynamoDB.DocumentClient();

function findUser(username, callback) {
    let params = {
        TableName: "users",
        KeyConditionExpression: "#user = :name",
        ExpressionAttributeNames: {
            "#user": "username"
        },
        ExpressionAttributeValues: {
            ":name": username
        }
    };

    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            if(data.Items.length > 0)
                callback(null, true);
            else
                callback(null, false);
        }
    });
}

function putParams (params, callback) {
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON: ", JSON.stringify(err, null, 2))
            callback(err, null);
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            callback(null, true);
        }
    });
}

function putEmail (email, callback) {
    let params = {
        TableName: "used-emails",
        Item: {
            "email": email
        }
    };
    putParams(params, function(err, result) {
        if (err) {
            callback(err, null);
        }
        else callback(null, true);
    })
}

function createUser (username, password, email, callback) {
    let guid = uuidv4();
    let hashedPassword = passwordHash.generate(password);
    let hashedEmail = passwordHash.generate(email);
    let params = {
        TableName: "users",
        Item: {
            "user_guid": guid,
            "username": username,
            "password": hashedPassword,
            "email": hashedEmail
        }
    };
    findUser(username, function (err, exist) {
       if (err) {
           callback(err, null);
       }
       else {
           if (!exist)
               putParams(params, function (err, data) {
                   if (err) callback(err, null);
                   else putEmail(email function(err, res) {callback(err, res)});
               });
           else
               callback(null, "User already Exists");
       }
    });
}

function validateLogin (username, password, callback) {
    let params = {
        TableName: "users",
        KeyConditionExpression: "#user = :name",
        ExpressionAttributeNames: {
            "#user": "username"
        },
        ExpressionAttributeValues: {
            ":name": username
        }
    };

    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            callback(err, null);
        } else {
            console.log("Query succeeded.");
            if(data.Items.length > 0) {
                let hashedPassword = data.Items[0].password;
                callback(null, passwordHash.verify(password, hashedPassword));
            }
            else {
                callback("No User Found", null);
            }
        }
    });
}

function findGuidByUsername (username, callback) {
    let params = {
        TableName: "users",
        KeyConditionExpression: "#user = :name",
        ExpressionAttributeNames: {
            "#user": "username"
        },
        ExpressionAttributeValues: {
            ":name": username
        }
    };

    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            callback(err, null);
        } else {
            console.log("Query succeeded.");
            if(data.Items.length > 0)
                callback(null, data.Items[0].user_guid);
            else
                callback("No User Found", null);
        }
    });
}

function checkIfEmailIsUsed(email, callback) {
    let params = {
        TableName: "used-emails",
        KeyConditionExpression: "#used-email = :email",
        ExpressionAttributeNames: {
            "#used-email": "emails"
        },
        ExpressionAttributeValues: {
            ":email": email
        }
    };
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            callback(err, null);
        } else {
            console.log("Query succeeded.");
            if(data.Items.length > 0)
                callback(null, false);
            else
                callback(null, true);
        }
    });

}

module.exports = {
    createUser : createUser,
    validateLogin : validateLogin,
    findGuidByUsername : findGuidByUsername,
    checkIfEmailIsUsed : checkIfEmailIsUsed
}
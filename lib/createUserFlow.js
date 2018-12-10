let dynamoFunction = require('./dynamoFunctions');
let s3Function = require('./s3Functions');

function createUser(username, password, email, callback) {
    dynamoFunction.createUser(username, password, email, function (err, guid) {
        if (err) {
            console.log("Error Creating DDB User Entry: " + err);
            callback(err, null);
        }
        s3Function.uploadNewUser(username, guid, function(err, succ) {
            if(err) {
                console.log("Error Creating S3 User JSON: " + err);
                callback(err, null);
            }
            else callback(null, guid);
        })
    });
}

module.exports = createUser;
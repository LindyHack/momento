let aws = require("aws-sdk");
let multer = require("multer");
let multerS3 = require("multer-s3");
const uuidv4 = require('uuid/v4');
require('dotenv').config();
aws.config.update({
    region: "us-east-2"
});

let s3 = new aws.S3();

function uploadNewUser(guid, callback) {
    let body = {
        posts: [],
        subscriptions:[]
    };
    saveUser(guid, body, function(err, data) {
        if (err) callback(err, null);
        else callback(null, true);
    });
}

function saveUser(guid, body, callback) {
    const params = {
        Bucket: 'momento-users',
        Key: guid+".json",
        Body: JSON.stringify(body),
        ContentType: "application/json"
    };

    s3.upload(params, function(err, data) {
        if (err) callback(err, null);
        else callback(null, true);
    });
}

function retrieveUserJson(guid, callback) {
    const params = {
        Bucket: 'momento-users',
        Key: guid + ".json"
    };
    s3.getObject(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else callback(null, JSON.parse(data.Body.toString()));
    });
}

// let upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'momento-posts',
//         contentType: multerS3.AUTO_CONTENT_TYPE,
//         key: function (req, file, cb) {
//             cb(null, uuidv4());
//         }
//     })
// });

function createUploadObject (user_guid, post_guid, extension){
    return multer({
        storage: multerS3({
            s3: s3,
            bucket: 'momento-posts',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function (req, file, cb) {
                cb(null, user_guid+"/"+post_guid+"."+extension);
            }
        })
    });
}


module.exports = {
    uploadNewUser : uploadNewUser,
    saveUser : saveUser,
    retrieveUserJson : retrieveUserJson,
    createUploadObject : createUploadObject
}
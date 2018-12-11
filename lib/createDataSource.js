let s3Function = require("./s3Functions.js");
let async = require("async");
let sort = require("fast-sort");

function createDataSource(guid, callback) {
    s3Function.retrieveUserJson(guid, function(err, response) {
        if(err) callback(err, null);
        let dataSource = response;
        dataSource.feed = [];
        let subscriptions = dataSource.subscriptions;
        async.each(subscriptions, function(guid, callback) {
            s3Function.retrieveUserJson(guid, function(err, response) {
                if(err) callback(err);
                dataSource.feed.concat(createPostLinks(response.user_guid, response.posts));
                callback();
            });
        }, function(err) {
            if(err) callback(err, null);
            sort(dataSource.feed).desc("date");
            callback(null, dataSource);
        });
    })
}

function createPostLinks(guid, posts) {
    for(let i = 0; i < posts.length; i++) {
        posts[i].link = guid+"/"+posts[i].post_guid+"."+posts[i].extension;
    }
    return posts;
}

module.exports = createDataSource;
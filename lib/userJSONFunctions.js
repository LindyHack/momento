const uuidv4 = require('uuid/v4');
let path = require('path');

function createPost(file) {
    return {
        date: Date.now().toString(),
        post_guid: uuidv4(),
        type: file.type,
        extension: path.extname(file)
    }
}

function createCommentJSON(post_guid) {
    return {
        post_guid: post_guid,
        comments: [
        ]
    }
}

function createComment(username, user_guid, text, file) {
    if (file === null || file === undefined) {
        return {
            text: text,
            username: username,
            user_guid: user_guid,
            date: Date.now().toString(),
            file:  {}
        };
    }
    return {
        text: text,
        username: username,
        user_guid: user_guid,
        date: Date.now().toString(),
        file:  this.createPost(file)
    };
}

module.exports = {
    createPost : createPost,
    createCommentJSON : createCommentJSON,
    createComment : createComment
};
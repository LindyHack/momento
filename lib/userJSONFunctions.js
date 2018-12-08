const uuidv4 = require('uuid/v4');

function createPost(file) {
    return {
        date: Date.now().toString(),
        post_guid: uuidv4(),
        type: file.type
    }
}

module.exports = {
    createPost : createPost
};
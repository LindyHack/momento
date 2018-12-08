const uuidv4 = require('uuid/v4');
let upload = require('../lib/s3Functions').createUploadObject("38267b03-0e97-45aa-a85b-fb3db7def82d", uuidv4(), "png");
const express = require("express");
const app = express();
const port = 3000;

const singleUpload = upload.single('image');

app.post('/image-upload', function(req, res) {
    singleUpload(req, res, function(err, some) {
        if (err) {
            return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}] });
        }

        return res.json({'imageUrl': req.file.location});
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
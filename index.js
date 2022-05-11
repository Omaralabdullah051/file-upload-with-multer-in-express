const express = require('express');
const port = process.env.PORT || 5000;
//need to npm i multer and then require it.
const multer = require("multer");
const path = require('path');

//File upload folder
const UPLOADS_FOLDER = "./uploads/";

//define the storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") + "-" + Date.now();
        cb(null, fileName + fileExt);
    }
})

//prepare the final multer upload object
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2000000, //2 MB
    },
    fileFilter: (req, file, cb) => {
        console.log(file);
        if (file.fieldname === "avatar") {
            if (
                file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg"
            ) {
                cb(null, true);
            }
            else {
                cb(new Error("Only .jpg,.png, or .jpeg format allowed!"));
            }
        }
        else if (file.fieldname === "doc") {
            if (
                file.mimetype === "application/pdf") {
                cb(null, true);
            }
            else {
                cb(new Error("Only .pdf formate allowed!"));
            }
        }
        else {
            cb(new Error("There was an unknown error!"));
        }
    }
});

const app = express();


//*application route
// //*for single field to upload single file
// app.post('/', upload.single("avatar"), (req, res) => {
//     res.send("Hello World");
// });

//*for single field to upload multiple files
// app.post('/', upload.array("avatar", 3),(req, res) => {
//     res.send("Hello world");
// })


//*for multiple fields to upload files
app.post('/', upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "doc", maxCount: 1 }
]), (req, res) => {
    console.log(req.files);
    res.send("Hello world");
});

//*When we don't want to upload file but want to upload form data
// app.post('/', upload.none(), (req, res) => {
//     console.log(req.body.name);
//     res.send("Hello world");
// })

//default error handler
app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) { //to catch the specific multer error
            res.status(500).send("There was an upload error");
        }
        else {
            res.status(500).send(err.message); //the overall application error
        }
    }
    else {
        res.send("Success");
    }
})

app.listen(port, () => {
    console.log(`Listening to the port ${port}`);
});
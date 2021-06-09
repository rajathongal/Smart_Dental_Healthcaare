const express = require("express");
const router = express.Router();
const { spawn } = require('child_process');
const fs = require("fs");

//router.post("/predict", async (req, res) => {
exports.Prediction = async (req, res) => {
    console.log(req.body, "from pred")
    const python = spawn('dental/bin/python', ['./3_Inference/Detector.py','--is_tiny']);

    python.stdout.on('data', async (data) => {
        console.log(data)
        var exists = fs.existsSync(`./Data/Source_Images/Test_Image_Detection_Results/${req.file.originalname}`);
        if(exists){
            console.log(exists)
            res.download(`./Data/Source_Images/Test_Image_Detection_Results/${req.file.originalname}`)
        }
    })

    python.on('close',  (code) => {
        
        if (code === 0){
            fs.unlink(`./Data/Source_Images/Test_Image_Detection_Results/${req.file.originalname}`, function(err) {
                if(err && err.code == 'ENOENT') {
                    // file doens't exist
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    // other errors, e.g. maybe we don't have enough permission
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info(`removed`);
                }
            });

            fs.unlink(`./Data/Source_Images/Test_Images/${req.file.originalname}`, function(err) {
                if(err && err.code == 'ENOENT') {
                    // file doens't exist
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    // other errors, e.g. maybe we don't have enough permission
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info(`removed`);
                }
            });

            fs.unlink(`./Data/Source_Images/Test_Image_Detection_Results/Detection_Results.csv`, function(err) {
                if(err && err.code == 'ENOENT') {
                    // file doens't exist
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    // other errors, e.g. maybe we don't have enough permission
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info(`removed`);
                }
            });
           
        } else {
            res.json({
                success:false,
                message: code
            }).end();
        }
        
    })

    // fs.exists(req.file.path, function (exists) {
    //     console.log(exists)
    //     if(exists){
    //         var contentType = req.mimetype;

    //         // res.writeHead(200, { 'Content-Type': contentType});

    //         fs.readFile(req.file.path, function (err, content) {
    //             console.log(content)
               
    //             // res.set({'Content-Type': contentType})
    //             // res.send(content)
                
    //             res.download(req.file.path)
    //         });
    //     }
        

    // });
    // await spawn('python', ['.\dental\Scripts\activate']);

    // const python = spawn('python', [' .\3_Inference\Detector.py --is_tiny']);

    // python.stdout.on('data', function (data) {
    //     console.log(data)
    // })

    // python.on('close', (code) => {
    //     console.log(code, "from code")
    // })
    // //console.log(req.file.buffer, req.file.mimetype)

    // return res.json({
    //     status: "executed"
    // })
};

//module.exports = router;
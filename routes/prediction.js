const express = require("express");
const router = express.Router();
const { spawn } = require('child_process');
const fs = require("fs");
const path = require("path");

//router.post("/predict", async (req, res) => {
exports.Prediction = async (req, res) => {
    console.log(req.body, "from body")
    if (!req.body.file) {
        return res.send('No files were uploaded.');
      } else {
          
        var filename = `${req.body.fileName}.${req.body.type.split("/")[1]}`;
        var filenameWithPath = `./Data/Source_Images/Test_Images/${req.body.fileName}.${req.body.type.split("/")[1]}`;
        //var base64Data = req.body.file.replace(/^data:image\/png;base64,/,"");
        var binaryData = Buffer.from(req.body.file, 'base64')//new Buffer(req.body.file, 'base64').toString('binary');

        try {
            // await fs.writeFileSync(filenameWithPath, binaryData, function(err) {
            //     console.log(err, "from writeup");
            // })

            // await fs.writeFile(filenameWithPath, req.body.file, {encoding: 'base64'}, function(err){
            //     return res.send(err);
            // });
            
            await fs.writeFileSync(filenameWithPath, binaryData, function(err) {
              console.log(err, "from writeup");
            });

            var exist = fs.existsSync(`./Data/Source_Images/Test_Images/${filename}`);
            console.log(exist, "from file upload")
        } catch (err){
            return res.send(err);
        }
        const python = spawn('dental/bin/python', ['./3_Inference/Detector.py','--is_tiny']);

        python.stdout.on('data', async (data) => {
                
                var exists = fs.existsSync(`./Data/Source_Images/Test_Image_Detection_Results/${filename}`);
                console.log(exists, "from exists")
                if(exists){
                    //res.download(`./Data/Source_Images/Test_Image_Detection_Results/${filename}`)
                    var options = {
                        root: path.join(__dirname)
                    };
                    console.log(options)

                    res.sendFile(`../Data/Source_Images/Test_Image_Detection_Results/${filename}`, options, function (err) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('Sent:', filename);
                        }
                    })
                }   
            })

        python.on('close',  (code) => {
            
            if (code === 0){
                fs.unlink(`./Data/Source_Images/Test_Image_Detection_Results/${filename}`, function(err) {
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
    
                fs.unlink(`./Data/Source_Images/Test_Images/${filename}`, function(err) {
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
               
            }    
        })

    }
};


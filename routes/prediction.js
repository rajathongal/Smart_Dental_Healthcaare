const express = require("express");
const router = express.Router();
const { spawn } = require('child_process');
const fs = require("fs");

//router.post("/predict", async (req, res) => {
exports.Prediction = async (req, res) => {
    console.log(req.file)
    console.log(req.body)
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.send('No files were uploaded.');
      } else {
          console.log(req.files)
        var filename = `${req.files.fileName}.${req.files.type.split("/")[1]}`;
        var filenameWithPath = `./Data/Source_Images/Test_Images/${req.files.fileName}.${req.files.type.split("/")[1]}`;
        var base64Data = req.files.base64.replace(/^data:image\/png;base64,/,"");
        var binaryData = new Buffer(base64Data, 'base64').toString('binary');

        await fs.writeFileSync(filenameWithPath, binaryData, function(err) {
            console.log(err, "from writeup");
        })
    
        const python = spawn('dental/bin/python', ['./3_Inference/Detector.py','--is_tiny']);
        
        python.stdout.on('data', async (data) => {
            
            var exists = fs.existsSync(`./Data/Source_Images/Test_Image_Detection_Results/${filename}`);
           
            if(exists){
                res.download(`./Data/Source_Images/Test_Image_Detection_Results/${filename}`)
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


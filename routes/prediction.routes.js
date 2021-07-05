const express = require("express");
const router = express.Router();
const { spawn } = require('child_process');
const fs = require("fs");
const path = require("path");

exports.Prediction = async (req, res) => {

    console.log(req.body, `test.${req.body.type.split("/")[1]}`, )
    try {
        var filename = `test.${req.body.type.split("/")[1]}`;
        var filenameWithPath = `test.${req.body.type.split("/")[1]}`;
        var binaryData = Buffer.from(req.body.file, 'base64')

        if (!req.body.file) {

            return res.send('No files were uploaded.');

        } else {

            await fs.writeFileSync(filenameWithPath, binaryData, function(err) {
                console.log(err, "from writeup");
            });

            var exist = fs.existsSync(`./${filename}`);
            console.log(exist, "from file upload", `"./${filename}"`)

            const python = spawn('dental/bin/python', ['./detect.py','--source', `"./${filename}"`, '--weights', `"./runs/train/exp/weights/best.pt"`]);

            python.stdout.on('data', async (data) => {
                
                var exists = fs.existsSync(`./runs/detect/exp/${filename}`);
                console.log(exists, "from exists")
                if(exists){
                    //res.download(`./Data/Source_Images/Test_Image_Detection_Results/${filename}`)
                    var options = {
                        root: path.join(__dirname)
                    };
                    console.log(options)

                    res.sendFile(path.resolve(`./runs/detect/exp/${filename}`), {},function (err) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('Sent:', filename);
                        }
                    })
                }   
            });

            python.on('close',  (code) => {
            
                if (code === 0){
                    fs.unlink(`./runs/detect/exp/${filename}`, function(err) {
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
        
                    fs.rmdirSync(`./runs/detect/exp`, function(err) {
                        if(err && err.code == 'ENOENT') {
                            // file doens't exist
                            console.info("File doesn't exist, won't remove it.");
                        } else if (err) {
                            // other errors, e.g. maybe we don't have enough permission
                            console.error("Error occurred while trying to remove file");
                        } else {
                            console.info(`removed`);
                        }
                    })
                   
                }    
            })

        }
    } catch (err) {
        res.status(501).json({
            success: false,
            err: err.message
        })
    }

    
}
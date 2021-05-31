const express = require("express");
const router = express.Router();
const { spawn } = require('child_process');
const fs = require("fs");

router.post("/predict", async (req, res) => {
    // console.log(req.file)
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
        console.log(code, "from code")
        if (code === 0){

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
});

module.exports = router;
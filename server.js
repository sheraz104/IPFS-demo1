var http = require('http');
var fs = require("fs");
var express = require("express");
var path = require("path");
const IPFS = require('ipfs');
var bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
var ipfsAPI = require('ipfs-api')

const app = express();

app.use(fileUpload());



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname)));

app.post("/file", (req, res) => {
    var node = ipfsAPI('/ip4/127.0.0.1/tcp/5001')

    node.files.add({
        path: 'file',
        content: Buffer.from(req.files.file.data.toString())
    }, (err, filesAdded) => {
        if (err) { console.log(err); }

        // Once the file is added, we get back an object containing the path, the
        // multihash and the sie of the file
        console.log('\nAdded file:', filesAdded[0].path, filesAdded[0].hash)

        var fileMultihash = filesAdded[0].hash

        res.send({ hash: fileMultihash })

    })
}
)


app.get("/getFile/:hash", (req, res) => {
    console.log(req.params.hash);
    var node = ipfsAPI('/ip4/127.0.0.1/tcp/5001')

    node.files.cat(req.params.hash, (err, data) => {
        if (err) { console.log(err) }

        console.log('\nFile content:')
        // print the file to the terminal and then exit the program
        // console.log(data.toString())
        fs.writeFile("file.txt", data.toString(), function (err) {
            if (err) {
                return console.log(err);
            }
            res.download(path.join(__dirname+"/file.txt"));
        });
    })
})
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});




app.listen(process.env.PORT || 3000, () => {
    console.log('server is running on 3000');
});


console.log(`Worker ${process.pid} started`);
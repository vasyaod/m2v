const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const UUID = require('uuid-js');
const fs = require('fs');
const ffmpeg = require('ffmpeg-static');
const spawn = require('child_process').spawn;
const resolve = require('path').resolve

// const multer = require('multer');
// const upload = multer();
const formidableMiddleware = require('express-formidable');

const port = 8081

var tmpDir = './tmp'
if (!fs.existsSync(tmpDir)){
  fs.mkdirSync(tmpDir);
}

app.use(bodyParser.text())
app.use(bodyParser.json())
app.use(bodyParser.raw({type: 'application/octet-stream', limit : '10mb'}))
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(upload.array()); 

// app.use(formidableMiddleware({
//   encoding: 'utf-8',
//   uploadDir: './tmp',
//   multiples: true, // req.files to be arrays of files
// }));

app.use('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Content-Type', 'application/json; charset=UTF-8')
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type,token')
  next()
})

app.listen(port, function() {
  console.log('Listening on port ' + port)
})

app.get('/status', (req, res) =>
  res.send(`Ok`)
)

app.post('/video', async (req, res) => {
  const id = UUID.create().toString()
  const dir = `${tmpDir}/${id}`
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  res.send(id)
})

app.post('/video/:encodeId/:frameId', async (req, res) => {
  const { encodeId, frameId } = req.params
  const data = req.body
//  console.log(">>>> ", req)
//  console.log(">>>> ", data, req.files, req.fields)

  const dir = `${tmpDir}/${encodeId}`
  if (fs.existsSync(dir)){
    fs.writeFile(`${dir}/frame-${frameId}.png`, data, function(err) {
      res.send('Ok')
    }); 
  }
})

app.get('/video/:encodeId', async (req, res) => {
  const { encodeId } = req.params

  const dir = `${tmpDir}/${encodeId}`
  const outputFile = `${dir}/output.mp4`
  const cmd = ffmpeg.path;
  const args = [
    "-framerate", 1,
    "-pattern_type", "sequence",
    "-start_number", "0",
    "-i", `${dir}/frame-%d.png`,
    "-y",
    outputFile
  ];

  console.log(cmd + ' "' + args.join('" "') + '"');
  var proc = spawn(cmd, args);
  proc.on('close', function (code) {
    var code = parseInt(code);
    console.log("Return code: " + code)
//    res.send('Ok')
    res.download(resolve(outputFile), "map.mp4", {headers: {'Content-Type': 'video/mp4'}})
  });
})

process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))

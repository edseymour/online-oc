var cc       = require('config-multipaas'),
    finalhandler= require('finalhandler'),
    http     = require("http"),
    express      = require('express'),
    Router       = require('router'),
    async = require('async'),
    bodyParser   = require('body-parser'),
    fs = require('fs'),
    serveStatic       = require("serve-static");

var oc = require('./modules/oc')

var config   = cc();
var app      = Router()

app.use(serveStatic('static'))

app.get("/status", function(req,res) {
  res.statusCode = 200
  res.setHeader('Content-Type','application/json; charset=utf-8')
  res.end("{status: 'ok'}\n")
})


function home_page(req,res) {
  
  var index = fs.readFileSync(__dirname + '/index.html')
  res.statusCode = 200
  res.setHeader('Content-Type','text/html; charset=utf-8')
  res.end(index.toString())
}

var api = Router()
app.use('/', api)

api.use(bodyParser.urlencoded())

api.get("/", home_page )

api.post("/", function(req,res) {

  if (req.body.command) {

    var err_msg;
    var out_msg;

    async.series([

      // call oc commandline
      function(callback) {
        var method_error;
        oc.run_command(req.body.command,function(error,out,err) {

            console.log("stdout: ",out)
            console.log("stderr: ",err)
            if (error) { console.log("An error occurred: ",error) }

            err_msg = err
            out_msg = out
            method_error = error
        });

        callback(method_error,out_msg + " " + err_msg)
      },
      function(callback) {
        res.statusCode = 200
        res.setHeader('Content-Type','text/html; charset=utf-8')

        var body = "<html><head><title>Online OC</title></head><body>"
        body += "<h1>Response</h1><code>"
        body += out
        body += "</code><h3>Info</h3><code>"
        body += err
        body += "</code><br /><a href="/">Again</a></body></html>"

        console.log("rendering: ",body)

        res.end(body)

        callback(null,body)
      }
    ],
    function(err,results) {
      if (err) { console.log("ERROR: ",err) }
      else {
        console.log("command: ",results[0])
        console.log("render: ",results[1])
      }
    });

  } else {
    console.log("body value null")
    home_page(req,res)
  }

})

var server = http.createServer(function (req, res) {
  var done = finalhandler(req, res)
  app(req, res, done)
});

server.listen(config.get('PORT'),config.get('IP'),function() {
  console.log( "Listening on " + config.get('IP') +":" + config.get('PORT') )
});

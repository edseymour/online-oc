var cc       = require('config-multipaas'),
    finalhandler= require('finalhandler'),
    http     = require("http"),
    Router       = require('router'),
    fs = require('fs'),
    serveStatic       = require("serve-static");

var oc = require('modules/oc')

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

app.get("/", home_page(req,res))

app.post("/", function(req,res) {
  oc.run_command(req.params.command)
  home_page(req,res)

})

var server = http.createServer(function (req, res) {
  var done = finalhandler(req, res)
  app(req, res, done)
});

server.listen(config.get('PORT'),config.get('IP'),function() {
  console.log( "Listening on " + config.get('IP') +":" + config.get('PORT') )
});

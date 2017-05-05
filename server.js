var cc       = require('config-multipaas'),
    express      = require('express'),
    bodyParser   = require('body-parser')

var oc = require('./modules/oc')

var config   = cc();
var app      = express();

oc_responses =  {};
oc_histnum = 0;

app.get("/status", function(req,res) {
  res.statusCode = 200
  res.setHeader('Content-Type','application/json; charset=utf-8')
  res.end("{status: 'ok'}\n")
})

app.set('view engine','ejs')
app.set('view options', { layout: false })
app.use('/public', express.static('public'))

app.use(bodyParser.urlencoded( {extended: true}))
app.use(bodyParser.json())

app.get("/", function(req,res){
  res.render('index', { command: null, history: oc_responses });
})


app.post("/", function(req,res) {

  if (req.body.command) {

    oc.run_command(req.body.command,function(error,out,err) {

      console.log("stdout: ",out)
      console.log("stderr: ",err)
      if (error) { console.log("An error occurred: ",error) }

      oc_responses[oc_histnum] = { "command" : req.body.command, "error" : error, "stdout" : out, "stderr" : err }
      oc_histnum++
    });


  } else {
    console.log("body value null")
  }

  res.render('result',{ command: req.body.command, history: oc_responses } )

})

app.listen( config.get('PORT') || 8080 )


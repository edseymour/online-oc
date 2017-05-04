module.exports = {
  run_command: function(cmd) {
    var exec  = require('child_process').exec,
      child;

    child = exec('/usr/bin/oc ' + cmd, function (error,stdout,stderr) {
      console.log('stdout',stdout);
      console.log('stderr',stderr);
      if (error != null) {
        console.log('exec error: ',error);
      }
    });
  }
};

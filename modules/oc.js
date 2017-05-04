module.exports = {
  run_command: function(cmd,cmdback) {
    var exec  = require('child_process').exec,
      child;

    child = exec('/usr/bin/oc ' + cmd, cmdback )
    
  }
};

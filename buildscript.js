var fs = require('fs');
var path = require('path');
var eol = require('eol');

var match_rgx = new RegExp(/\/\/\-\-\s*([\w\\\/\.]+)\s*$/gm);
var del_rgx = new RegExp(/^(\/\/\-\-\s*[\w\\\/\.]+\s*\n)/gm);
var root_path = './build';

(function() {

  var file_counter = 0;
  var hasTraversed = false;
  var tree = [];
  var placement = [];

  var isJavascriptFile = function(f) {
    var ext = '.js';
    var index = f.lastIndexOf(ext);
    return index === f.length - ext.length;
  };

  var traverse = function(p) {
    var output = [];
    var contents = fs.readdirSync(p);

    contents.forEach(function(val, i, array) {
      var f = path.join(p, val);
      var isDirectory = fs.lstatSync(f).isDirectory();

      if(isDirectory) {
        traverse(f);
      }
      else if(isJavascriptFile(f)) {
        file_counter++;
        fs.readFile(f, 'utf8', fileReadComplete(f));
      }
    });

    return output;
  };

  var fileReadComplete = function(name) {
    return function(err, data) {
      if(err) {
        console.log('Error ->', err);
        process.exit(1);
      }

      tree.push({
        name: name,
        data: eol.lf(data),
        dependencies: []
      });

      file_counter--;

      if(file_counter === 0 && hasTraversed) {
        buildTreeDependencies();
      }
    };
  };

  var buildTreeDependencies = function() {
    tree.forEach(function(val, i, array) {
      var dp = [];
      var matches = [];

      while((matches = match_rgx.exec(val.data)) !== null) {
        val.dependencies.push(path.join(root_path, matches[1]));
      }

      if(val.dependencies.length === 0) {
        placement.push(val.name);
      }

      val.data = val.data.replace(del_rgx, '');
    });

    orderTreeDependencies();
  };

  var orderTreeDependencies = function() {
    tree.forEach(function(val, i, array) {
      if(val.dependencies.length > 0) {

      }
    });
  };

  traverse(root_path);
  hasTraversed = true;
})();

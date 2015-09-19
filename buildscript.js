var fs = require('fs');
var path = require('path');
var eol = require('eol');

var rg_file = new RegExp(/^-F *$/);
var rg_tree = new RegExp(/^-T *$/);
var rg_cmt = new RegExp(/(\/\/.*)$/);
var root_path = './build';
var jsmap_type = '.jsmap';

(function() {
  var file_counter = 0;
  var contents = fs.readdirSync(root_path);
  var maps = {};
  var hasTraversed = false;

  var isOfType = function(f, ext) {
    var index = f.lastIndexOf(ext);
    return index === f.length - ext.length;
  };

  var fileReadComplete = function(name) {
    return function(err, data) {
      if(err) {
        console.log('Error ->', err);
        process.exit(1);
      }

      maps[name] = {
        data: parseData(data)
      };

      console.log(maps[name].data);

      file_counter--;

      if(file_counter === 0 && hasTraversed) {
        buildFileMapping();
      }
    };
  };

  var parseData = function(data) {
    var lines = lineify(data);

    var output = [];

    var mode = 'none';

    lines.forEach(function(line, i, a) {
      line = line.trim();
      if(line.length === 0) {
        return;
      }

      if(rg_tree.test(line)) {
        mode = 'tree';
        output.push({
          type: 'tree',
          values: []
        });

        return;
      }

      if(rg_file.test(line)) {
        mode = 'file';
        output.push({
          type: 'file',
          values: []
        });

        return;
      }

      if(mode === 'none') {
        return;
      }

      var matches = [];
      var trueline = line;
      while((matches = rg_cmt.exec(trueline)) !== null) {
        console.log(matches);
        trueline = trueline.replace(matches[1], '');
      }

      trueline = trueline.trim();

      if(trueline.length === 0) {
        return;
      }

      output[output.length -1].values.push(path.join(root_path, trueline));
    });

    return output;
  };

  var lineify = function(data) {
    return eol.lf(data).split('\n');
  };

  contents.forEach(function(val, i, a) {
    var f = path.join(root_path, val);

    if(fs.lstatSync(f).isDirectory() || !isOfType(f, jsmap_type)) {
      console.log('fail');
      return;
    }

    file_counter++;
    fs.readFile(f, 'utf8', fileReadComplete(f));
  });

  hasTraversed = true;

})();

/*var match_rgx = new RegExp(/\/\/\-\-\s*([\w\\\/\.]+)\s*$/gm);
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
*/

var fs = require('fs');
var path = require('path');
var eol = require('eol');

var rg_file = new RegExp(/^-F *$/);
var rg_tree = new RegExp(/^-T *$/);
var rg_cmt = new RegExp(/(\/\/.*)$/);
var root_path = './public/script';
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

  var lineify = function(data) {
    return eol.lf(data).split('\n');
  };

  var addExtension = function(name, new_ext) {
    if(name.indexOf(new_ext) !== name.length - new_ext.length) {
      return name + new_ext;
    }

    return name;
  };

  var changeExtension = function(name, new_ext) {
    var dotidx = name.lastIndexOf('.');
    return (dotidx === -1) ? name + new_ext : name.substring(0, dotidx) + new_ext;
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
        startFileMappings();
      }
    };
  };

  var startFileMappings = function() {
    for(var i in maps) {
      if(maps.hasOwnProperty(i)) {

        buildFileMapping(changeExtension(i, '.js'), maps[i].data);
      }
    }
  };

  var buildFileMapping = function(name, data) {
    var output = [];

    data.forEach(function(map_section) {
      if(map_section.type === 'tree') {
        var files = readTrees(map_section.values);
        output = output.concat(files);
      }
      else {
        output = output.concat(map_section.values);
      }
    });

    console.log('Build structure:\n', output);
    readFileData(name, output);
  };

  var readFileData = function(name, values) {
    var readyToWrite = false;
    var dataBuffer = [];
    var readCounter = 0;

    values.forEach(function(file, index, array) {
      readCounter++;
      var fname_true = addExtension(file, '.js');
      console.log('Reading file ', fname_true)
      fs.readFile(fname_true, 'utf8', function(err, data) {
        if(err) {
          console.log('Error reading file [' + file + '] ->\n', err);
          process.exit(1);
        }

        array[index] = data;
        readCounter--;

        if(readCounter === 0 && readyToWrite) {
          writeFile(name, array.join(''));
        }
      });
    });

    readyToWrite = true;
  };

  var writeFile = function(name, data) {
    console.log(data);
    fs.writeFileSync(name, data);
  };

  var readTrees = function(values) {
    output = [];

    values.forEach(function(tree) {
      var tree_contents = fs.readdirSync(tree);

      tree_contents.forEach(function(file) {
        var fpath = path.join(tree, file);
        if(fs.lstatSync(fpath).isDirectory() || !isOfType(fpath, '.js')) {
          return;
        }
        else {
          output.push(fpath);
        }
      });
    });

    return output;
  };

  var parseData = function(data) {
    var lines = lineify(data);

    var output = [];

    var options = {
      mode: 'mode'
    };

    lines.forEach(function(line) {
      parseLine(line, output, options);
    });

    return output;
  };

  var parseLine = function(line, output, options) {
    line = line.trim();
    if(line.length === 0) {
      return;
    }

    var new_mode = rg_tree.test(line) ? 'tree' : (rg_file.test(line) ? 'file' : options.mode);

    if(new_mode === 'none') {
      return;
    }
    else if (new_mode !== options.mode) {
      output.push({
        type: new_mode,
        values: []
      });

      options.mode = new_mode;
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
  };

  contents.forEach(function(file) {
    var f = path.join(root_path, file);

    if(fs.lstatSync(f).isDirectory() || !isOfType(f, jsmap_type)) {
      return;
    }

    file_counter++;
    fs.readFile(f, 'utf8', fileReadComplete(f));
  });

  hasTraversed = true;
})();

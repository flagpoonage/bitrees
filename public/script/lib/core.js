(function() {
  'use strict';

  function protoFn(base) {
    return function() {
      if(BT.U.df(base)) {
        base.prototype.init.call(this);
      }

      BT.U.fixContext(this);
      this.init();
    };
  }

  var defaultExtendOptions = function(options) {
    options = BT.U.df(options, {});
    options.initInheritance = BT.U.df(options.initInheritance, true);

    return options;
  };

  var core = {
    Global: {},
    makeEvents: function() {
      return new BT.Events();
    },

    log: function() {
      if(window.console && window.console.log) {
        console.log(Array.prototype.slice.call(arguments, 0));
      }
    },

    make: function(obj, base) {
      var proto = protoFn(base);

      for(var i in obj) {
        if(BT.U.hop(obj, i)) { proto.prototype[i] = obj[i]; }
      }

      proto.prototype.init = BT.U.fn(obj.init, function() {});

      return proto;
    },

    makeGlobal: function(obj) {
      return new (BT.make(obj))();
    },

    extend: function(type, obj, options) {
      options = defaultExtendOptions(options);
      var proto = BT.make(obj, options.initInheritance ? type : undefined);

      for(var i in type.prototype) {
        if(BT.U.hop(type.prototype, i) && i !== 'init') {
          if(!BT.U.df(proto.prototype[i])) {
            proto.prototype[i] = type.prototype[i];
          }
        }
      }

      return proto;
    },

    extendGlobal: function(type, obj, options) {
      return new (BT.extend(type, obj, options))();
    }
  };

  window.BT = core;
})();

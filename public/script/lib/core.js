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
    options.preserveConstructionChain = BT.U.df(options.preserveConstructionChain, true);
  };

  var core = {
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
        if(BT.U.hop(obj, i)) {
          proto.prototype[i] = obj[i];
        }
      }

      proto.prototype.init = BT.U.fn(obj.init, function() {});

      return proto;
    },

    extend: function(type, obj, options) {
      options = defaultExtendOptions(options);
      var proto = BT.make(obj, type);

      for(var i in type.prototype) {
        if(BT.U.hop(type.prototype, i) && i !== 'init') {
          proto.prototype[i] = type.prototype[i];
        }
      }

      return proto;
    }
  };

  window.BT = core;
})();

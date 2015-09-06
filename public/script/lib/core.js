(function() {
  'use strict';

  var protoFn = function() {
    return function() {
      BT.U.fixContext(this);
      this._ = {};
      this._constructor.call(this, Array.prototype.slice.call(arguments, 0));
    };
  };

  var core = {
    log: function() {
      if(window.console && window.console.log) {
        console.log(Array.prototype.slice.call(arguments, 0));
      }
    },

    make: function(obj) {
      var proto = protoFn();
      proto.prototype._constructor = BT.U.hop(obj, 'constructor', function() {});

      for(var i in obj) {
        if(BT.U.hop(obj, i) && BT.U.fn(obj[i])) {
          proto.prototype[i] = obj[i];
        }
      }

      return proto;
    },

    extend: function(type, obj) {
      var proto = BT.make(obj);

      for(var i in type.prototype) {
        if(BT.U.hop(type.prototype, i) && BT.U.fn(type.prototype[i])) {
          proto.prototype[i] = type.prototype[i];
        }
      }

      var baseConstruct =
        BT.U.fn(type.prototype._constructor) ? type.prototype._constructor : function() {};

      proto.prototype._constructor = BT.U.hop(obj, 'constructor', baseConstruct);

      return proto;
    }
  };

  window.BT = core;
})();

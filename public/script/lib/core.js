(function() {
  'use strict';

  var EventsObject = function() {
    BT.U.fixContext(this);
    this._ = {};
  };

  EventsObject.prototype = {
    _: {},
    on: function(ev, callback, context) {
      if(BT.U.df(this._[ev])) {
        this._[ev].push(callback);
      }
      else {
        this._[ev] = [{ cb: callback, ctx: context }];
      }
    },

    off: function(ev, callback) {
      if(!BT.U.df(this._[ev])) { return; }

      for(var i = 0; i < this._[ev].length; i++) {
        if(this._[ev][i].cb === callback) {
          this._[ev].splice(i, 1);
        }
      }

      if(this._[ev].length === 0) {
        delete this._[ev];
      }
    },

    out: function(ev) {
      var args = Array.prototype.slice.call(arguments, 1);

      if(!BT.U.df(this._[ev])) { return; }

      for(var i = 0; i < this._[ev].length; i++) {
        this._[ev][i].cb.apply(this._[ev][i].ctx, args);
      }
    }
  };

  var protoFn = function() {
    return function() {
      BT.U.fixContext(this);
      this._ = {};
      this._constructor.call(this, Array.prototype.slice.call(arguments, 0));
    };
  };

  var defaultExtendOptions = function(options) {
    options = BT.U.df(options, {});
    options.preserveConstructionChain = BT.U.df(options.preserveConstructionChain, true);
  };

  var core = {
    makeEvents: function() {
      return new EventsObject();
    },

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

    extend: function(type, obj, options) {
      options = defaultExtendOptions(options);
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
  window.BT.events = new window.BT.makeEvents();
})();

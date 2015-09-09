(function() {

  function EventsObject() {
    BT.U.fixContext(this);
    this._ = {};
  }

  EventsObject.prototype = {
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

  BT.Events = EventsObject;
  BT.events = BT.makeEvents();
})();

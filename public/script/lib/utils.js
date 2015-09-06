(function(){
  'use strict';

  var udf = 'undefined';
  var fun = 'function';
  var str = 'string';

  BT.U = {
    on: function(evt, target, listener) {
      target.addEventListener(evt, listener);
    },

    fixContext: function(o) {
      for(var i in o) {
        if(o.hasOwnProperty(i) && BT.U.fn(o[i])) {
          o[i] = o[i].bind(o);
        }
      }
    },

    fn: function(x, o) {
      var r = typeof x === fun;
      return typeof o === udf ? r : (r ? x : o);
    },

    df: function(x, o) {
      var r = typeof x !== udf;
      return typeof o === udf ? r : (r ? x : o);
    },

    st: function(x, o) {
      var r = typeof x === str;
      return typeof o === udf ? r : (r ? x : o);
    },

    hop: function(o, v, e) {
      var r = o.hasOwnProperty(v);
      return BT.U.df(e) ? (r ? o[v] : e) : r;
    },
  };

})();

(function(){
  'use strict';

  var udf = 'undefined';
  var fun = 'function';
  var str = 'string';

  BT.U = {
    each: function(array, fn, context) {
      context = BT.U.df(context) ? context : this;

      for(var i = 0; i < array.length; i++) {
        fn.call(context, array[i]);
      }
    },

    first: function(val) {
      return BT.U.df(val[0]) ? val[0] : val;
    },

    fixContext: function(o) {
      for(var i in o) {
        if(o.hasOwnProperty(i) && BT.U.fn(o[i])) {
          o[i] = o[i].bind(o);
        }
      }
    },

    isntObject: function(x) {
      return BT.U.st(x) || !isNaN(x) || x.isArray || x instanceof Date;
    },

    isObject: function(x) {
      return !BT.U.st(x) && isNaN(x) && !x.isArray && !(x instanceof Date);
    },

    ar: function(x, o) {
      var r = x.isArray;
      return typeof o === udf ? r : (r ? x : o);
    },

    dt: function(x, o) {
      var r = x instanceof Date;
      return typeof o === udf ? r : (r ? x : o);
    },

    nm: function(x, o) {
      var r = !isNaN(x);
      return typeof o === udf ? r : (r ? x : o);
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

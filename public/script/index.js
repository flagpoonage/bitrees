window.D = document;
window.W = window;

BT.U.on('DOMContentLoaded', D, function() {
  BT.log('Content loaded');

  var Thing = BT.make({
    constructor: function() {
      this.value = 200;
    },

    getValue: function() {
      return this.value;
    },

    setValue: function(value) {
      this.value = value;
    }
  });

  var Other = BT.extend(Thing, {
    otherFunction: function() {
      BT.log('It worked!', this);
    }
  });

  var Custom = BT.extend(Other, {});

  var t = new Thing();
  var o = new Other();
  var c = new Custom();

  BT.log(t, t.getValue());
  BT.log(o, o.getValue());
  BT.log(c, c.getValue());

  o.otherFunction();
});

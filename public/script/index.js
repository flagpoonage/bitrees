window.D = document;
window.W = window;

BT.U.ready(function() {
  BT.log('Content loaded');

  var Thing = BT.make({
    init: function() {
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
    init: function() {
      this.value2 = 300;
    },

    getValue: function() {
      return [this.value, this.value2];
    }
  });

  var Custom = BT.extend(Other, {});

  var t = new Thing();
  var o = new Other();
  var c = new Custom();

  BT.log(t, t.getValue());
  BT.log(o, o.getValue());
  BT.log(c, c.getValue());

  var q = new BT.App.EventBase();

  BT.log(q);

  o.otherFunction();
});

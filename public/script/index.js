window.D = document;
window.W = window;

BT.H.ready(function() {
  var app = new BT.App();

  var tree = {
    name: 'root',

    value2: {
      name: 'Some checkbox item',
      type: BT.App.Enums.nodeType.CHECK,
      value: true
    },

    value3: {
      name: 'Some other item',
      type: BT.App.Enums.nodeType.CHECK,
      value: false,
    }

  };

  app.loadTree({
    name: 'root',
    value2: {

    }
  });
});

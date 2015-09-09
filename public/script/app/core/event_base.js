(function() {
  BT.App.EventBase = BT.extend(BT.App.CoreBase, {
    init: function() {
      this.events = BT.makeEvents();
      this._ = {
        events: BT.events
      };
    }
  });
})();

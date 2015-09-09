(function() {
  BT.Templates = BT.makeGlobal({
    init: function() {
      this.templates = {};
      this.core = BT.H.$(BT.H.selector('template-container') + ' script[type="text/html"]');
      this.loadTemplates();
      BT.log(this.core);
    },

    loadTemplates: function() {
      BT.U.each(this.core, this.parseTemplate, this);
    },

    parseTemplate: function(el) {
      var content = BT.U.first(BT.H.parseHtml(el.innerHTML));
      this.templates[el.id] = content;
    },

    get: function(name) {
      return this.templates[name];
    }
  });
})();

(function() {
  BT.H = {
    selector: function(val, key) {
      return '[' + BT.H.attr(val, key) + ']';
    },

    attr: function(val, key) {
      key = BT.U.df(key, 'bitrees');
      return key + '=' + val;
    },

    parseHtml: function(content) {
      var el = document.createElement('div');
      el.innerHTML = content;
      var children = BT.H.elNodesFromList(el.childNodes);
      return children.length === 1 ? children[0] : children;
    },

    $: function(selectors, el) {
      if(!BT.U.df(el)) { el = document; }
      return el.querySelectorAll(selectors);
    },

    on: function(evt, target, listener) {
      target.addEventListener(evt, listener);
    },

    ready: function(listener) {
      document.addEventListener('DOMContentLoaded', listener);
    },

    elNodesFromList: function(nList) {
      for(var i = 0, out = []; i < nList.length; i++) {
        if(nList[i].nodeType !== 1) { continue; }
        out.push(nList[i]);
      }
      return out;
    }
  };
})();

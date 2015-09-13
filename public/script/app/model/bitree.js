(function() {
  BT.App.Treenode = BT.extend(BT.App.EventBase, {
    init: function(val) {
      this._.tree = val;
      this.buildTree();
    },

    buildTree: function() {
      this.children = {};

      for(var i in this._.tree) {
        if(BT.U.hop(this._.tree, i) && BT.U.isObject(this._.tree[i])) {
          this.children[i] = new BT.App.Treenode(this._.tree[i]);
        }
      }
    },

    extractSelf: function() {
      var extraction = {};

      for(var i in this._.tree) {
        if(BT.U.hop(this._.tree, i) && !BT.U.df(this.children[i])) {
          extraction[i] = this._.tree[i];
        }
      }

      return extraction;
    }
  });
})();

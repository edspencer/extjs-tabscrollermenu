Ext.ns('Ext.ux.menu');

/**
 * @class Ext.ux.menu.TextFilterItem
 * @extends Ext.menu.Item
 * Provides a menu item with a text field
 */
Ext.ux.menu.TextFilterItem = Ext.extend(Ext.menu.Item, {
  
  /**
   * @property emptyText
   * @type String
   * The string to show in the textfield before the user has entered their own text
   */
  emptyText: "filter items...",
  
  /**
   * @property emptyCls
   * @type String
   * A CSS class to add to the text field when the user has not entered their own text
   */
  emptyCls: 'x-tab-filter-empty',
  
  /**
   * @property baseCls
   * @type String
   * The CSS class to add to the input element
   */
  baseCls: 'x-tab-filter',
  
  ctype: "Ext.ux.menu.TextFilterItem",
  
  /**
   * Renders the HTML for this component
   * @param {Ext.Container} ct The container to render this component to
   * @param {Number} position The position within the parent container to render this component to
   */
  onRender: function(ct, position) {
    this.el = ct.createChild({
      tag:   'input', 
      type:  'text', 
      value: this.emptyText,
      cls:   this.baseCls
    });
    
    this.el.on('keyup', this.updateCls,    this);
    this.el.on('focus', this.onFocus,      this);
    this.el.on('blur',  this.onBlur,       this);
    
    this.relayEvents(this.el, ['keydown', 'keyup', 'keypress']);
    
    this.updateCls();
  },
  
  /**
   * Adds or removes the textfield's empty CSS class as necessary
   */
  updateCls: function() {
    var val = this.el.dom.value;
    if (val.length > 0 && val != this.emptyText) {
      this.el.removeClass(this.emptyCls);
    } else {
      this.el.addClass(this.emptyCls);
    };
  },
  
  /**
   * Private - removes this.emptyText when focussed
   */
  onFocus: function() {
    if (this.el.dom.value == this.emptyText) {
      this.el.dom.value = "";
    }
  },
  
  /**
   * Private - adds this.emptyText when blurred and empty
   */
  onBlur: function() {
    if (this.el.dom.value == "") {
      this.el.dom.value = this.emptyText;
    };
  },
  
  /**
   * Stops the menu from being closed when this is clicked on
   */
  handleClick: function() {
    return false;
  }
});
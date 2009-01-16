Ext.ns('Ext.ux.menu');

/**
 * @class Ext.ux.menu.TextFieldItem
 * @extends Ext.menu.Item
 * Provides a menu item with a text field
 */
Ext.ux.menu.TextFieldItem = Ext.extend(Ext.menu.Item, {
  
  ctype: "Ext.ux.menu.TextFieldItem",
  
  /**
   * Renders the HTML for this component
   * @param {Ext.Container} ct The container to render this component to
   * @param {Number} position The position within the parent container to render this component to
   */
  onRender: function(ct, position) {
    this.textField = ct.createChild({
      tag:  'input',
      type: 'text'
    });
    
    this.relayEvents(this.textField, ['keydown', 'keyup', 'keypress']);
    
    // Ext.ux.menu.TextFieldItem.superclass.onRender.apply(this, arguments);
  },
  
  handleClick: function() {
    return false;
  }
});
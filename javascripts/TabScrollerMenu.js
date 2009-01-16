Ext.ns('Ext.ux');

/**
 * @class Ext.ux.TabScrollerMenu
 * @extends Ext.menu.Menu
 * @author Ed Spencer (http://edspencer.net)
 * Provides basic tab management for tab panels with a large number of tabs
 * Reworking of original created by Jay Garcia (http://tdg-i.com/59/how-to-add-a-tab-scroller-menu)
 * Not that there's anything wrong with Jay's version, I'm just having some fun.
 * Yeah, I probably do need to get out more
 */
Ext.ux.TabScrollerMenu = Ext.extend(Ext.menu.Menu, {
  
  /**
   * @property pageSize
   * @type Number
   * The number of tab links to show per submenu
   */
  pageSize: 10,
  
  /**
   * @property truncateLength
   * @type Number
   * The maximum length of submenu text to display before truncation
   */
  truncateLength: 12,
  
  /**
   * @property hasFilter
   * @type Boolean
   * True to include an optional filter textbox which removes any non-matching menu items
   */
  hasFilter: true,
  
  defaultAlign: 'tl-tr', //aligns the menu with the top right edge of the menu trigger
  shadow:       false,
  
  /**
   * Sets up plugin, creates a clickable element to trigger this menu to be displayed
   * @param {Ext.TabPanel} tabPanel The TabPanel to attach this plugin to
   */
  init: function(tabPanel) {
    this.tabPanel = tabPanel;
    this.createMenuItems();
    
    var menuRef = this;
    
    //creates the menu trigger element in the TabPanel header
    this.tabPanel.createScrollers = this.tabPanel.createScrollers.createSequence(function() {
      //adjust containing elements to make room for new menu trigger
      Ext.fly(this.header.child('.x-tab-scroller-right')).applyStyles({right: '18px'});
      Ext.get(this.strip.dom.parentNode).applyStyles({'margin-right': '36px'});
      
      //create the menu trigger
      this.tabMenuTrigger = this.header.insertFirst({cls: "x-tab-panel-menu"});
      this.tabMenuTrigger.setHeight(this.stripWrap.dom.offsetHeight);
      this.tabMenuTrigger.on('click', function() { menuRef.show(this.tabMenuTrigger); }, this);
      this.tabMenuTrigger.addClassOnOver('x-tab-panel-menu-over');
    });
  },
  
  /**
   * Creates a menu item for each tab in the TabPanel (paginated if there are more than
   * the requested page size).  Optionally removes current menu items first
   * @param {Boolean} clearExisting True to remove all current menu items first (defaults to true)
   */
  createMenuItems: function(clearExisting) {
    var clearExisting = clearExisting ? clearExisting : true;
    if (clearExisting) { this.removeAll(); }
    this.createFilterMenu();
    
    var numberOfItems = this.tabPanel.items.length;
    
    if (numberOfItems > this.pageSize) {
      //need to make more than one 'page'
      var numberOfPages = Math.ceil(numberOfItems / this.pageSize);
      
      //create each submenu
      for (var i=0; i < numberOfPages; i++) {
        var subMenuItems = [];
        
        //create each submenu item
        for (var j = 0; j <= this.pageSize - 1; j++){
          var currentItem = this.tabPanel.items.items[j + (i * this.pageSize)];
          if (currentItem) {
            subMenuItems.push(this.createSubMenuItem(currentItem));
          };
        };
        
        //calculate text label for this submenu
        var lowerNumber = 1 + (this.pageSize * i);
        var higherNumber = Math.min(((i + 1) * this.pageSize), numberOfItems);
        var subMenuText  = String.format("Tabs {0}-{1}", lowerNumber, higherNumber);
        
        this.addMenuItem({text: subMenuText, menu: subMenuItems, iconCls: 'many'});
      };
      
    } else {
      //can put all items in the same 'page'
      this.tabPanel.items.each(function(item) {
        this.addMenuItem(this.createSubMenuItem(item));
      }, this);
    }
  },
  
  /**
   * Returns a config object for a tab, suitable for placement inside a submenu
   * @param {Object} panel The panel instance to create this submenu item from
   * @return {Object} An object suitable for addition to a submenu
   */
  createSubMenuItem: function(panel) {
    return {
      iconCls: panel.iconCls,
      text:    Ext.util.Format.ellipsis(panel.title, this.truncateLength),
      rawText: panel.title,
      scope:   this,
      handler: this.tabPanel.setActiveTab.createDelegate(this.tabPanel, [panel])
    };
  },
  
  /**
   * Adds a filter menu item with a TextField if this.hasFilter is true
   * @return {Ext.menu.MenuItem/Null} The filter menu item
   */
  createFilterMenu: function() {
    if (this.hasFilter) {
      this.filterMenu = this.addMenuItem({
        text:    'Search',
        iconCls: 'find',
        menu: [
          new Ext.ux.menu.TextFieldItem({
            name: 'filter',
            listeners: {
              keyup: { 
                scope: this,
                fn: function(e, input) {
                  this.filterItems(input.value);
                }
              }
            }
          })
        ]
      });
      
      return this.filterMenu;
    }
  },
  
  /**
   * Iterates over each submenu item, hiding it if it does not match the filter text
   * Also hides the menu item itself it all submenu items are hidden
   */
  filterItems: function(filterText) {
    var filterRegex = new RegExp(filterText);
    
    this.items.each(function(topMenu) {
      //don't filter on the filterMenu itself...
      if (topMenu != this.filterMenu) {
        if (topMenu.menu) {
          var hideMenu = true;
          
          //if we have submenu items, iterate over each and hide if necessary
          topMenu.menu.items.each(function(subMenuItem) {
            if (filterRegex.test(subMenuItem.rawText)) {
              subMenuItem.show();
              hideMenu = false;
            } else subMenuItem.hide();
          });
          
          //if we've hidden everything, hide the whole menu
          hideMenu ? topMenu.hide() : topMenu.show();
        } else {
          //if we don't have submenu items, iterate over top level menus and hide if necessary
          filterRegex.test(topMenu.rawText) ? topMenu.show() : topMenu.hide();
        }
      }
    }, this);
  }
  
});
/**
 * Creates 2 demo windows, one with 43 tab items, the other with 23
 * Window 1 has submenu items, Window 2 does not
 */
Ext.onReady(function() {
  var iconClasses = ['user', 'page', 'image', 'film', 'home'];
  
  var tp1Items = [];
  for (var i=1; i < 44; i++) {
    tp1Items.push({
      title:   String.format("Panel {0} Rah ", i),
      html:    String.format("Panel {0} Content", i),
      iconCls: iconClasses[Math.floor(Math.random() * iconClasses.length)]
    });
  };
  
  var tp2Items = [];
  for (var i=1; i < 24; i++) {
    tp2Items.push({
      title:   String.format("Panel {0} Title ", i),
      html:    String.format("Panel {0} Content", i),
      iconCls: iconClasses[Math.floor(Math.random() * iconClasses.length)]
    });
  };
  
  var win1 = new Ext.Window({
    width:  500,
    height: 300,
    layout: 'fit',
    title:  'Window with tabscroller menu and filtering',
    x: 10,
    y: 10,
    items:  [
      {
        xtype:           'tabpanel',
        items:           tp1Items,
        activeTab:       0,
        defaults:        { closable: true },
        enableTabScroll: true,
        plugins: [
          new Ext.ux.TabScrollerMenu()
        ]
      }
    ]
  });
  
  var win2 = new Ext.Window({
    width:  500,
    height: 300,
    layout: 'fit',
    title:  'Window with tabscroller menu and filtering - no nested submenus',
    x: 550,
    y: 10,
    items:  [
      {
        xtype:           'tabpanel',
        items:           tp2Items,
        activeTab:       0,
        defaults:        { closable: true },
        enableTabScroll: true,
        plugins: [
          new Ext.ux.TabScrollerMenu({
            pageSize:       25,
            truncateLength: 20
          })
        ]
      }
    ]
  });
  
  win1.show();
  win2.show();
});
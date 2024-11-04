sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("expcostcenter.project1.controller.App", {
        onInit: function() {

          var Tile1 = new sap.m.StandardTile( {
            removable: false,
            title    : "myTile1",
            info     : "Sample Info",
            infoState: sap.ui.core.ValueState.Success,
            type     : sap.m.StandardTileType.Monitor,
            icon     : sap.ui.core.IconPool.getIconURI('employee'),
           // number   : 1,
            press    : function() {
            App.to("landingPage"); } });
            Tile1.addStyleClass("Tile");
        }
      });
    }
  );
  
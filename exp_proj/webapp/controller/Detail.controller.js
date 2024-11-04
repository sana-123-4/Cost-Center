sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(
	Controller,Filter,FilterOperator
) {
	"use strict";

	return Controller.extend("exprpt.expproj.controller.Detail", {

        onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("RouteDetail").attachMatched(this._onRouteMatched, this);
			Kostl: null;
			Bukrs: null;
			Gjahr :null;
		},

        _onRouteMatched: function(oEvent) {

            var Kostl = oEvent.getParameter("arguments").Kostl;
			var Bukrs = oEvent.getParameter("arguments").Bukrs;
			var Gjahr = oEvent.getParameter("arguments").Gjahr;
			var Period = oEvent.getParameter("arguments").Period;

            var oSmartFilterBar = this.getView().byId("smartFilterBar1");
			var oTable = this.getView().byId("idTable");

            var jsonString = `{
				"Bukrs": {
					"value": "${Bukrs}",
					"ranges": [],
					"items": []
				},
				"Gjahr": {
					"value": "${Gjahr}",
					"ranges": [],
					"items": []
				},
				"Kostl": {
					"value": "${Kostl}",
					"ranges": [],
					"items": []
				},
				"Period": {
					"value": "${Period}",
					"ranges": [],
					"items": []
				}
			}`;

            //oSmartFilterBar.setFilterDataAsString(jsonString, true);

            // Retrieve filter data
           // var oFilterData = oSmartFilterBar.getFilterData();
			// Create filters array
            var aFilters = [];


            if(Bukrs){
				aFilters.push(new Filter("Bukrs", FilterOperator.EQ, Bukrs));
			}
			if(Gjahr){
				aFilters.push(new Filter("Gjahr", FilterOperator.EQ, Gjahr));
			}
			if(Kostl){
				aFilters.push(new Filter("Kostl", FilterOperator.EQ, Kostl));
			}
			if(Period){
				aFilters.push(new Filter("Period", FilterOperator.EQ, Period));
			}

            var oBusyDialog = new sap.m.BusyDialog({
                title : "Loading Data",
                text : "Loading"
            });
			oBusyDialog.open();

            oTable.bindItems({
                path: "/CostDetailOdataSet",
                template: oTable.getBindingInfo("items").template,
                filters: aFilters,

                // Event handler to manage BusyDialog
			events: {
				
				dataReceived: function() {
					// Close BusyDialog once data is successfully received
					oBusyDialog.close();
				}
			}
		    });

           // oSmartFilterBar.search();
        },

		// onSearchFieldLiveChange : function (oEvent) {
		// 	var oTable = this.getView().byId("idTable");
		// 	var sQuery = oEvent.getParameter("newValue");
		// 	//debugger;
		// 	var oFilter = [];
		// //	oFilter = new Filter("Belnr", "EQ", sQuery); 
		//     if(sQuery){
		// 	oFilter.push(new Filter("Belnr", FilterOperator.Contains, sQuery));
		// 	//oTable.getBinding("items").filter([oFilter]);
		// 	var oBinding = oTable.getBinding("items");
		// 	oBinding.filter(oFilter);
		// 	oBinding.attachEventOnce('dataReceived', function() {

		// 		// now activate suggestion popup
			 
		// 		sQuery.suggest();
			 
		// 	   }); 
		// 	}
		// },

        // Event handler when the SmartFilterBar search is triggered
        onSearchFilter: function () {
            var oSmartTable = this.getView().byId("smartTable1");
          //  oSmartTable.rebindTable();
        },
	});
});
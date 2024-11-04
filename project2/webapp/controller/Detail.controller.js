sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(
	Controller,Filter,FilterOperator
) {
	"use strict";

	return Controller.extend("costcenterrpt.project2.controller.Detail", {

		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("RouteDetail").attachMatched(this._onRouteMatched, this);
			Kostl: null;
			Bukrs: null;
			Gjahr :null;
		},
		_onRouteMatched: function(oEvent) {
			//debugger;
			var Kostl = oEvent.getParameter("arguments").Kostl;
			var Bukrs = oEvent.getParameter("arguments").Bukrs;
			var Gjahr = oEvent.getParameter("arguments").Gjahr;
			var Period = oEvent.getParameter("arguments").Period;
			

			//sap.ui.getCore().byId(this.createId("idKostl")).setText(Kostl);
			var oSmartFilterBar = this.getView().byId("smartFilterBar1");
			var oTable = this.getView().byId("idTable");
			

			// Set default values for filter fields
            
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

			oSmartFilterBar.setFilterDataAsString(jsonString, true);

			// Retrieve filter data
            var oFilterData = oSmartFilterBar.getFilterData();
			// Create filters array
            var aFilters = [];

            // Add filters based on selected values in SmartFilterBar
            // if (oFilterData.Bukrs) {
            //     aFilters.push(new Filter("Bukrs", FilterOperator.EQ, oFilterData.Bukrs.ranges[0].value1));
            // }
            // if (oFilterData.Gjahr) {
            //     aFilters.push(new Filter("Gjahr", FilterOperator.EQ, oFilterData.Gjahr.ranges[0].value1));
            // }
            // if (oFilterData.Budat) {
            //     aFilters.push(new Filter("Budat", FilterOperator.EQ, oFilterData.Budat));
            // }
            // if (oFilterData.Kostl) {
            //     aFilters.push(new Filter("Kostl", FilterOperator.EQ, oFilterData.Kostl.ranges[0].value1));
            // }
           //debugger;
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
			oSmartFilterBar.search();
			
		},

		// Event handler when the SmartFilterBar search is triggered
        onSearchFilter: function () {
            var oSmartTable = this.getView().byId("smartTable1");
          //  oSmartTable.rebindTable();
        },
	
	});
});
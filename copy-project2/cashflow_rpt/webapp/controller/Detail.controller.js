sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(
	Controller,Filter,FilterOperator
) {
	"use strict";

	return Controller.extend("cashflow.cashflowrpt.controller.Detail", {

        onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("RouteDetail").attachMatched(this._onRouteMatched, this);
			Hkont: null;
			Bukrs: null;
			Gjahr :null;
		},

        _onRouteMatched: function(oEvent) {

            var Hkont = oEvent.getParameter("arguments").Hkont;
			var Bukrs = oEvent.getParameter("arguments").Bukrs;
			var Gjahr = oEvent.getParameter("arguments").Gjahr;
			var Period = oEvent.getParameter("arguments").Period;
            
            var oTable = this.getView().byId("idTable");

            var aFilters = [];


            if(Bukrs){
                Bukrs = '1000';
				aFilters.push(new Filter("Bukrs", FilterOperator.EQ, Bukrs));
			}
			if(Gjahr){
                Gjahr = '2020';
				aFilters.push(new Filter("Gjahr", FilterOperator.EQ, Gjahr));
			}
			if(Hkont){
				aFilters.push(new Filter("Hkont", FilterOperator.EQ, Hkont));
			}
			if(Period){
				aFilters.push(new Filter("Zperiod", FilterOperator.EQ, Period));
			}

            var oBusyDialog = new sap.m.BusyDialog({
                title : "Loading Data",
                text : "Loading"
            });
			oBusyDialog.open();

            oTable.bindItems({
                path: "/ZFI_OCASHSet",
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
        }
	});
});
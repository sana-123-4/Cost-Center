sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function(
	Controller,
	Filter,FilterOperator,MessageToast
) {
	"use strict";

	return Controller.extend("glcostrept.glcostreport.controller.GLSumm", {

		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("RouteGLSumView").attachMatched(this._onRouteMatched, this);
			Period: null;
			Bukrs: null;
			Gjahr :null;
		},
		_onRouteMatched: function(oEvent) {

			this.Bukrs = oEvent.getParameter("arguments").Bukrs;
			this.Gjahr = oEvent.getParameter("arguments").Gjahr;
			this.Period = oEvent.getParameter("arguments").Period;

			var aFilters = [];
            if(this.Bukrs){
                aFilters.push(new Filter("Bukrs", FilterOperator.EQ, this.Bukrs));
            }

            if(this.Gjahr){
                aFilters.push(new Filter("Gjahr", FilterOperator.EQ, this.Gjahr));
            }

            if(this.Period){
                aFilters.push(new Filter("Zperiod", FilterOperator.EQ, this.Period));
            }
            
			this._callSummaryoData(aFilters);
		},
		
		_callSummaryoData : function(filterData){
			//debugger;
			var vizFrame = this.getView().byId("vizFrame");
            var bVisible = vizFrame.getVisible();
            vizFrame.setVisible(true);

			var oPieChart = this.getView().byId("vizFrame");
            var oBindingInfo = oPieChart.getBindingInfo;
            var oVizFrame = this.oVizFrame = this.getView().byId("vizFrame");
            var oTooltip = new sap.viz.ui5.controls.VizTooltip({});

            if (oBindingInfo) {
                oPieChart.getDataset().bindData({
                    path: "/ZFI_SUM_GLCASHset",
                    filters: filterData
                });

                oTooltip.connect(oVizFrame.getVizUid());
             }else{
                vizFrame.setVisible(false);
             }

			 var oTable = this.getView().byId("idTable");

			 oTable.bindItems({
				 path: "/ZFI_SUM_GLCASHset",  // OData entity set
				 template: oTable.getBindingInfo("items").template, // Use the existing template of the table
				 filters: filterData,  // Apply the filters
				 events: {
					 dataRequested: function() {
						 // Optional: Show a busy dialog or message when data is requested
						 MessageToast.show("Fetching data...");
					 },
					 dataReceived: function() {
						 // Optional: Close the busy dialog after data is received
						 MessageToast.show("Data loaded successfully!");
					 }
				 }
			 });

		},

		onNavigation : function(oEvent){

			var P_Bukrs = this.Bukrs;
			var P_Gjahr = this.Gjahr;
			var P_Period = this.Period;

            var oPath = oEvent.getSource().getBindingContext().getObject();
            var P_Hkont = oPath.Hkont;

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.navTo("RouteGLDetail", {
                Hkont: P_Hkont,
                Bukrs: P_Bukrs,
                Gjahr: P_Gjahr,
                Period:P_Period
            });
            
        }
	});
});
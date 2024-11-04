sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(
	Controller,Filter,FilterOperator
) {
	"use strict";

	return Controller.extend("glcostrept.glcostreport.controller.ExpenseSumm", {

        onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("RouteExpenSumView").attachMatched(this._onRouteMatched, this);
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
            if (this.Gjahr) {
                aFilters.push(new Filter("Gjahr", FilterOperator.EQ, this.Gjahr));
            }
            if (this.Period) {
                aFilters.push(new Filter("Zperiod", FilterOperator.EQ, this.Period));
            }

            this._onReadSummaryData(aFilters);
            
        },
        _onReadSummaryData : function(filterData){

            var oTable = this.getView().byId("idTable");

            var oPieChart = this.getView().byId("vizFrame");
            var oBindingInfo = oPieChart.getBindingInfo;
            var oVizFrame = this.oVizFrame = this.getView().byId("vizFrame");
            var oTooltip = new sap.viz.ui5.controls.VizTooltip({});

            if (oBindingInfo) {
                oPieChart.getDataset().bindData({
                    path: "/CostSummaryOdataSet",
                    filters: filterData
                });

                oTooltip.connect(oVizFrame.getVizUid());
             }else{
                vizFrame.setVisible(false);
             }

            
            var oBusyDialog = new sap.m.BusyDialog({
                title : "Loading Data",
                text : "Loading"
            });
           
            oTable.bindItems({
                path: "/CostSummaryOdataSet",
                template: oTable.getBindingInfo("items").template,
                filters: filterData
            });
        },

        onNavigation : function(oEvent){

			var P_Bukrs = this.Bukrs;
			var P_Gjahr = this.Gjahr;
			var P_Period = this.Period;

            var oPath = oEvent.getSource().getBindingContext().getObject();
            var P_Kostl = oPath.Kostl;

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.navTo("RouteExpenDetail", {
                Kostl: P_Kostl,
                Bukrs: P_Bukrs,
                Gjahr: P_Gjahr,
                Period:P_Period
            });
            
        }
	});
});
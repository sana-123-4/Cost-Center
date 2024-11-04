sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
],
function (Controller,Filter,FilterOperator,MessageToast) {
    "use strict";

    return Controller.extend("cashflow.cashflowrpt.controller.View", {
        onInit: function () {

            var oODataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZJI_FI_CASH_ODATA1_SRV/");
            var oView = this.getView();
            oView.setModel(oODataModel,'odataModel');

            var d=new Date();
            var curYear = d.getFullYear();
          
            var oBukrs  = '1000';
            var oGjahr  = '2020';
            var oPeriod = 'Yearly';

            var aFilters = [];
            if(oBukrs){
                aFilters.push(new Filter("Bukrs", FilterOperator.EQ, oBukrs));
            }

            if(oGjahr){
                aFilters.push(new Filter("Gjahr", FilterOperator.EQ, oGjahr));
            }

            if(oPeriod){
                aFilters.push(new Filter("Zperiod", FilterOperator.EQ, oPeriod));
            }

           
            this.callSummaryoData(aFilters);

        },
        onComChange : function(oEvent){
          var selBukrs =  oEvent.getParameters().selectedItem.getKey();

          var oSelect = this.getView().byId("customSelect");
            // Retrieve the selected Period item (optional, if you need the text)
            var oSelectedItem = oSelect.getSelectedItem();
            var sSelectedPeriod = oSelectedItem ? oSelectedItem.getText() : null;
           
            // Retrieve filter data
            var oSmartFilterBar = this.getView().byId("smartFilterBar");
            var oFilterData = oSmartFilterBar.getFilterData();
            
            var oGjahr   = oFilterData.Gjahr.ranges[0].value1;
            
            var aFilters = [];
            if(selBukrs){
                aFilters.push(new Filter("Bukrs", FilterOperator.EQ, selBukrs));
            }

            if(oGjahr){
                aFilters.push(new Filter("Gjahr", FilterOperator.EQ, oGjahr));
            }

            if(sSelectedPeriod){
                aFilters.push(new Filter("Zperiod", FilterOperator.EQ, sSelectedPeriod));
            }

            this.callSummaryoData(aFilters);
           
        },

        onPeriodChange: function(oEvent){
           var oPeriod =  oEvent.getParameters().selectedItem.mProperties.text;
          
           var oSelectedBukrs = this.getView().byId("idBukrsSelect").getSelectedItem();
           var selBukrs = oSelectedBukrs.mProperties.key;

           // Retrieve filter data
           var oSmartFilterBar = this.getView().byId("smartFilterBar");
           var oFilterData = oSmartFilterBar.getFilterData();
           
           var oGjahr   = oFilterData.Gjahr.ranges[0].value1;

           var aFilters = [];
            if(selBukrs){
                aFilters.push(new Filter("Bukrs", FilterOperator.EQ, selBukrs));
            }

            if(oGjahr){
                aFilters.push(new Filter("Gjahr", FilterOperator.EQ, oGjahr));
            }

            if(oPeriod){
                aFilters.push(new Filter("Zperiod", FilterOperator.EQ, oPeriod));
            }

            this.callSummaryoData(aFilters);
        },

        callSummaryoData : function(aFilters){


            // pie chart
          
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
                    filters: aFilters
                });

                oTooltip.connect(oVizFrame.getVizUid());
             }else{
                vizFrame.setVisible(false);
             }

            var oTable = this.getView().byId("idTable");

            oTable.bindItems({
                path: "/ZFI_SUM_GLCASHset",  // OData entity set
                template: oTable.getBindingInfo("items").template, // Use the existing template of the table
                filters: aFilters,  // Apply the filters
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

            var selBukrs = this.getView().byId("idBukrsSelect").getSelectedItem();
            var P_Bukrs = selBukrs.mProperties.key;

            var selPeriod = this.getView().byId("customSelect").getSelectedItem();
            var P_Period = selPeriod.mProperties.text;

            var oSmartFilterBar = this.getView().byId("smartFilterBar");
            var oFilterData = oSmartFilterBar.getFilterData();

            var P_Gjahr = oFilterData.Gjahr.ranges[0].value1;

            var oPath = oEvent.getSource().getBindingContext().getObject();
            var P_Hkont = oPath.Hkont;

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.navTo("RouteDetail", {
                Hkont: P_Hkont,
                Bukrs: P_Bukrs,
                Gjahr: P_Gjahr,
                Period:P_Period
            });
            
        }
    });
});

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
],
function (Controller,Filter,FilterOperator,MessageToast) {
    "use strict";

    return Controller.extend("costglrpt.costglreport.controller.View", {
        onInit: function () {

            var oODataModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZJI_FI_CASH_ODATA1_SRV/");
            var oODataModel2 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZJI_GL_ACC_ODATA_SRV/");
            var oView = this.getView();
                    // Set models to the view to use model names
            this.getView().setModel(oODataModel1, "oODataModel1");
            this.getView().setModel(oODataModel2, "oODataModel2");

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

        callSummaryoData: function(aFilters){
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

           var oPieChart2 = this.getView().byId("vizFrame2");
           var oBindingInfo2 = oPieChart2.getBindingInfo;
           var oVizFrame2 = this.oVizFrame2 = this.getView().byId("vizFrame2")  ;
           //var oTooltip2 = new sap.viz.ui5.controls.VizTooltip({});
//debugger;
           // Create tooltip and set it to VizFrame
            var oTooltip2 = new sap.viz.ui5.controls.VizTooltip();
            oTooltip2.connect(oVizFrame2.getVizUid());
            oTooltip2.setFormatString(sap.viz.ui5.format.ChartFormatter.DefaultPattern.SHORTFLOAT);
            //oTooltip2.setEnabled(true);

           var oODataModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZJI_FI_CASH_ODATA1_SRV/");
           var oODataModel2 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZJI_GL_ACC_ODATA_SRV/");
                   // Set models to the view to use model names
            this.getView().setModel(oODataModel1, "oODataModel1");
            this.getView().setModel(oODataModel2, "oODataModel2"); 
   
           if (oBindingInfo2) {

            // oVizFrame2.getDataset().bindData({
            //     path: "oODataModel2>/CostSummaryOdataSet",
            //     filters: aFilters
            // });

            var dataset = new sap.viz.ui5.data.FlattenedDataset({
                dimensions : [ {
                axis : 1,
                name : 'Cost Center',
                value : "{oODataModel2>KostlDes}",
                } ],
                measures : [ {
                name : 'Amount',
                value : "{oODataModel2>Dmbtr}",
                } ],
                data : {
                path : "oODataModel2>/CostSummaryOdataSet",
                filters: aFilters // LOOK HERE
               }
             });
           

            oTooltip2.connect(oVizFrame.getVizUid());
         }
        }
    });
});

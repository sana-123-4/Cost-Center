sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/m/SearchField',
    "sap/m/MessageToast",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/ui/model/json/JSONModel"
],
function (Fragment,Controller,Filter,FilterOperator,SearchField,MessageToast, ValueHelpDialog,JSONModel) {
    "use strict";

    return Controller.extend("expcostcenter.project1.controller.View", {
        onInit: function () {

            var oODataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZJI_GL_ACC_ODATA_SRV/"); 
            var oView = this.getView();
            oView.setModel(oODataModel,'odataModel');

           var vizFrame = this.getView().byId("vizFrame");
           var bVisible = vizFrame.getVisible();
           vizFrame.setVisible(!bVisible);

        },

         onValueHelpRequest: function(oEvent) {

            var oInput = oEvent.getSource();

            this._oBasicSearchField = new SearchField();
            if (!this._oValueHelpDialog) {

            this._oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog("inputKostl",{
                title: "Select Cost Center",
                supportRanges: true,
                key: "Kostl",
                descriptionKey: "Ltext",
                ok: function (oEvent) {
                    var aTokens = oEvent.getParameter("tokens");
                    
                    oInput.setValue(aTokens[0].getText());
                    this._oValueHelpDialog.close();
                }.bind(this),
                cancel: function () {
                    this._oValueHelpDialog.close();
                }.bind(this)
            });
        }

        var oColModel = new JSONModel({
            cols: [
                { label: "Cost Center", template: "Kostl" },  
                { label: "Description", template: "Ltext" }   
            ]
        });

        var of4Table = this._oValueHelpDialog.getTable();
        of4Table.setModel(oColModel,"columns");

        // Set the OData model for the dialog's table
        var oODataModel = this.getView().getModel();  // Assuming OData model is set on the view
        this._oValueHelpDialog.getTable().setModel(oODataModel);
        //debugger;
        // Bind the rows of the table to the OData entity set (e.g., "CompanyCodeSet")
        this._oValueHelpDialog.getTable().bindRows("/CostCenterDataSet");
       
        this._oValueHelpDialog.setRangeKeyFields([ {label:"Cost Center", Key:"Kostl"},{label:"Description", key:"Ltext"}]);
       
        
        if (of4Table.bindRows) {
           // of4Table.addColumn(oColModel);
            of4Table.bindAggregation("rows", "/CostCenterDataSet");
         }
        
         this._oValueHelpDialog.open();

        },

       

        onComChange:function (oEvent){

            var oSelBukrs = oEvent.getParameters().selectedItem.getKey();

            var oSelect = this.getView().byId("customSelect");
            // Retrieve the selected Period item (optional, if you need the text)
            var oSelectedItem = oSelect.getSelectedItem();
            var sSelectedPeriod = oSelectedItem ? oSelectedItem.getText() : null;

            this._callSummaryData(oSelBukrs,sSelectedPeriod);
            
        },

        onPeriodChange:function(oEvent){
            var sSelectedPeriod = oEvent.getParameters().selectedItem.getText();

            var oSelectBukrs = this.getView().byId("idBukrsSelect");
            // Retrieve the selected Bukrs item (optional, if you need the text)
            var oSelectedBukrs = oSelectBukrs.getSelectedItem();
            var oSelBukrsKey = oSelectedBukrs ? oSelectedBukrs.getKey() : null;

            this._callSummaryData(oSelBukrsKey,sSelectedPeriod);
        },

        onReadSummaryData: function () {
            // Get a reference to the SmartFilterBar
           
            var oSelect = this.getView().byId("customSelect");
            var oSelectBukrs = this.getView().byId("idBukrsSelect");
            
            // Retrieve the selected Period item (optional, if you need the text)
            var oSelectedItem = oSelect.getSelectedItem();
            var sSelectedText = oSelectedItem ? oSelectedItem.getText() : null;

            // Retrieve the selected Bukrs item (optional, if you need the text)
            var oSelectedBukrs = oSelectBukrs.getSelectedItem();
            var oSelBukrsKey = oSelectedBukrs ? oSelectedBukrs.getKey() : null;
            
            this._callSummaryData(oSelBukrsKey,sSelectedText);
            
          
        },

        _callSummaryData: function(pBukrs,pPeriod){
           
            var oSmartFilterBar = this.getView().byId("smartFilterBar");
            
            // Get the table reference
            var oTable = this.getView().byId("idTable");

            // Get the OData model
            var oModel = this.getView().getModel();

            // Retrieve filter data
            var oFilterData = oSmartFilterBar.getFilterData();

            // Create filters array
            var aFilters = [];

            
            if(pBukrs){
                aFilters.push(new Filter("Bukrs", FilterOperator.EQ, pBukrs));
            }
            if (oFilterData.Gjahr) {
                aFilters.push(new Filter("Gjahr", FilterOperator.EQ, oFilterData.Gjahr.ranges[0].value1));
            }
            if (oFilterData.Budat) {
                aFilters.push(new Filter("Budat", FilterOperator.EQ, oFilterData.Budat));
            }
            if (oFilterData.Kostl) {
                aFilters.push(new Filter("Kostl", FilterOperator.EQ, oFilterData.Kostl.ranges[0].value1));
            }
            if(pPeriod){
                aFilters.push(new Filter("Period", FilterOperator.EQ,pPeriod));
            }

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
                    path: "/CostSummaryOdataSet",
                    filters: aFilters
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
                filters: aFilters
            });
        },

     
        onNavigation : function(oEvent){
            
            var oSelect = this.getView().byId("customSelect");
            var oSelectBukrs = this.getView().byId("idBukrsSelect");
            
            // Retrieve the selected item (optional, if you need the text)
            var oSelectedItem = oSelect.getSelectedItem();
            var sSelectedText = oSelectedItem ? oSelectedItem.getText() : null;

            // Retrieve the selected Bukrs item (optional, if you need the text)
            var oSelectedBukrs = oSelectBukrs.getSelectedItem();
            var oSelBukrsKey = oSelectedBukrs ? oSelectedBukrs.getKey() : null;

            var oPath = oEvent.getSource().getBindingContext().getObject();
            var P_Kostl = oPath.Kostl;

            var oSmartFilterBar = this.getView().byId("smartFilterBar");
            var oFilterData = oSmartFilterBar.getFilterData();

            if(oSelBukrsKey){
              var  P_Bukrs =  oSelBukrsKey;
            }
            // var P_Bukrs = oFilterData.Bukrs.ranges[0].value1;
            var P_Gjahr = oFilterData.Gjahr.ranges[0].value1;
            var P_Period = sSelectedText;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.navTo("RouteDetail", {
                Kostl: P_Kostl,
                Bukrs: P_Bukrs,
                Gjahr: P_Gjahr,
                Period:P_Period
            });
        }
    });
});

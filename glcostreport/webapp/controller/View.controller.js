sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    'sap/m/SearchField',
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
],
function (Controller,Filter,FilterOperator,MessageToast,SearchField,ValueHelpDialog,JSONModel,Fragment) {
    "use strict";

    return Controller.extend("glcostrept.glcostreport.controller.View", {
        onInit: function () {

            this.oODataModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZJI_FI_CASH_ODATA1_SRV/");
            this.oODataModel2 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZJI_GL_ACC_ODATA_SRV/");
            var oView = this.getView();

            var oSmartFilterBar = this.getView().byId("smartFilterBar");

            // Retrieve the VizFrame instance
            var oVizFrame = this.getView().byId("vizFrame");
            oVizFrame.attachSelectData(this.onGLChartClick.bind(this));

            var oVizFrame2 = this.getView().byId("vizFrame2");
            oVizFrame2.attachSelectData(this.onExpChartClick.bind(this));

                    // Set models to the view to use model names
            this.getView().setModel(this.oODataModel1, "oODataModel1");
            this.getView().setModel(this.oODataModel2 , "oODataModel2");

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

            this.callCashChartoData(aFilters);
            this.callCostChartoData(aFilters);


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

             
              this.callCashChartoData(aFilters);
              this.callCostChartoData(aFilters);
             
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
            
              this.callCashChartoData(aFilters);
              this.callCostChartoData(aFilters);
          },
  
        callCashChartoData: function(aFilters){

            // pie chart
            var vizFrame = this.getView().byId("vizFrame");
            var bVisible = vizFrame.getVisible();
            vizFrame.setVisible(true);

            vizFrame.setVizProperties({
                plotArea: {
                    dataLabel: {
                        visible: true,         
                        type: 'value',        
                        showTotal: true,      
                        style: {
                            color: null        
                        }
                    }
                },
                
            });

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

                oVizFrame.getParent().addDependent(oTooltip);
             }else{
                vizFrame.setVisible(false);
             }

     
        
        },

        callCostChartoData: function(aFilters){

           
           var oPieChart2 = this.getView().byId("vizFrame2");
           var oBindingInfo2 = oPieChart2.getBindingInfo;
           var oVizFrame2 = this.oVizFrame2 = this.getView().byId("vizFrame2")  ;
          
           oVizFrame2.setVizProperties({
            plotArea: {
                colorPalette: d3.scale.category20().range(),
                dataLabel: {
                    showTotal: true
                }
            },
            tooltip: {
                visible: true
            },
            title: {
                text: "Cost Center Wise Expense Report"
            }
        });
           
           var oTooltip2 = new sap.viz.ui5.controls.VizTooltip({});
          
         
        //    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
        //     dimensions: [{
        //         name: "Cost Center",
        //         value: "{CostSummaryOdataSet>KostlDes}"
        //     }],

        //     measures: [{
        //         name: "Amount",
        //         value: "{CostSummaryOdataSet>Dmbtr}"
        //     }],

        //     data: {
        //         path: "/CostSummaryOdataSet",
        //         filters: aFilters
        //     }
        // });
        
        // oVizFrame2.setDataset(oDataset);

		// oVizFrame2.setModel(this.oODataModel2);

        // var oFeedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
        //     "uid": "valueAxis",
        //     "type": "Measure",
        //     "values": ["Amount"]
        // }),

        // oFeedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
        //     "uid": "categoryAxis",
        //     "type": "Dimension",
        //     "values": ["Cost Center"]
        // });
        // oVizFrame2.addFeed(oFeedValueAxis);
        // oVizFrame2.addFeed(oFeedCategoryAxis);
           if (oBindingInfo2) {

            oVizFrame2.getDataset().bindData({
                path: "/CostSummaryOdataSet",
                filters: aFilters
            });

           
            oTooltip2.connect(oVizFrame2.getVizUid());
         }
        },

        onGLChartClick: function (oEvent) {
           
            var oData = oEvent.getParameter("data");

            var selBukrs = this.getView().byId("idBukrsSelect").getSelectedItem();
            var P_Bukrs = selBukrs.mProperties.key;

            var selPeriod = this.getView().byId("customSelect").getSelectedItem();
            var P_Period = selPeriod.mProperties.text;

            var oSmartFilterBar = this.getView().byId("smartFilterBar");
            var oFilterData = oSmartFilterBar.getFilterData();

            var P_Gjahr = oFilterData.Gjahr.ranges[0].value1;

            var P_Bukrs  = '1000';
            var P_Gjahr  = '2020';
            var P_Period = 'Yearly';

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.navTo("RouteGLSumView", {
                Bukrs: P_Bukrs,
                Gjahr: P_Gjahr,
                Period:P_Period
            });
           
        },
        onExpChartClick : function(oEvent){
            var oData = oEvent.getParameter("data");

            var selBukrs = this.getView().byId("idBukrsSelect").getSelectedItem();
            var P_Bukrs = selBukrs.mProperties.key;

            var selPeriod = this.getView().byId("customSelect").getSelectedItem();
            var P_Period = selPeriod.mProperties.text;

            var oSmartFilterBar = this.getView().byId("smartFilterBar");
            var oFilterData = oSmartFilterBar.getFilterData();

            var P_Gjahr = oFilterData.Gjahr.ranges[0].value1;

            var P_Bukrs  = '1000';
            var P_Gjahr  = '2020';
            var P_Period = 'Yearly';

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.navTo("RouteExpenSumView", {
                Bukrs: P_Bukrs,
                Gjahr: P_Gjahr,
                Period:P_Period
            });
        },
        onValueHelpRequest : function(oEvent)
        {
            var oInput = oEvent.getSource();
            var oView = this.getView();

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
                    sap.m.MessageToast.show("Cancel pressed!");
                    this._oValueHelpDialog.close();
                }.bind(this),
                afterClose: function() {
                    this._oValueHelpDialog.destroy();
                }
            });

            // if (!this._pValueHelpDialog) {
			// 	this._pValueHelpDialog = Fragment.load({
			// 		id: oView.getId(),
			// 		name: "glcostrept.glcostreport.fragments.ValueHelpDialog",
			// 		controller: this
			// 	}).then(function (oValueHelpDialog){
			// 		oView.addDependent(oValueHelpDialog);
			// 		return oValueHelpDialog;
			// 	});
			// }
			// this._pValueHelpDialog.then(function(oValueHelpDialog){
			// 	this._configValueHelpDialog();
			// 	oValueHelpDialog.open();
			// }.bind(this));
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

            var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
                advancedMode:  true,
			    filterBarExpanded: false,
            });
            
        this._oValueHelpDialog.open();
            
        },
        // _configValueHelpDialog: function () {
        //     debugger;
        //     this.oODataModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZJI_FI_CASH_ODATA1_SRV/");
        //     var sInputValue = this.byId("inputFieldWithF4").getValue(),
        //     oModel = this.getOwnerComponent().getModel(this.oODataModel1 );
        //     aProducts = oModel.getProperty("/CostCenterDataSet");
           
        // aProducts.forEach(function (oProduct) {
        //     oProduct.selected = (oProduct.Name === sInputValue);
        // });
        // oModel.setProperty("/CostCenterDataSet", aProducts);
        // }

        // #region Whitespace value help
		onWhitespaceVHRequested: function() {
			var oTextTemplate = new Text({text: {path: 'SAKNR'}, renderWhitespace: true});
			this._oBasicSearchField = new SearchField({
				search: function() {
					this.oWhitespaceDialog.getFilterBar().search();
				}.bind(this)
			});

			this.pWhitespaceDialog = this.loadFragment({
				name: "glcostrept.glcostreport.fragments.ValueHelpDialog"
			}).then(function(oWhitespaceDialog) {
				var oFilterBar = oWhitespaceDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
				this.oWhitespaceDialog = oWhitespaceDialog;

				this.getView().addDependent(oWhitespaceDialog);

				// Set key fields for filtering in the Define Conditions Tab
				oWhitespaceDialog.setRangeKeyFields([{
					label: "Product Code",
					key: "SAKNR",
					type: "string",
					typeInstance: new TypeString({}, {
						maxLength: 10
					})
				}]);

				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				// Re-map whitespaces
				oFilterBar.determineFilterItemByName("SAKNR").getControl().setTextFormatter(this._inputTextFormatter);

				oWhitespaceDialog.getTableAsync().then(function (oTable) {
					oTable.setModel(this.oModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						oColumnProductCode = new UIColumn({label: new Label({text: "Product Code"}), template: oTextTemplate});
						oColumnProductCode.data({
							fieldName: "SAKNR"
						});
						oTable.addColumn(oColumnProductCode);

						oColumnProductName = new UIColumn({label: new Label({text: "Product Name"}), template: new Text({wrapping: false, text: "{ProductName}"})});
						oColumnProductName.data({
							fieldName: "MCOD1"
						});
						oTable.addColumn(oColumnProductName);
						oTable.bindAggregation("rows", {
							path: "/GLAccDataSet",
							events: {
								dataReceived: function() {
									oWhitespaceDialog.update();
								}
							}
						});
					}

					// For Mobile the default table is sap.m.Table
					if (oTable.bindItems) {
						oTable.addColumn(new MColumn({header: new Label({text: "Product Code"})}));
						oTable.addColumn(new MColumn({header: new Label({text: "Product Name"})}));
						oTable.bindItems({
							path: "/GLAccDataSet",
							template: new ColumnListItem({
								cells: [new Label({text: "{SAKNR}"}), new Label({text: "{MCOD1}"})]
							}),
							events: {
								dataReceived: function() {
									oWhitespaceDialog.update();
								}
							}
						});
					}

					oWhitespaceDialog.update();
				}.bind(this));

				oWhitespaceDialog.setTokens(this._oWhiteSpacesInput.getTokens());
				oWhitespaceDialog.open();
			}.bind(this));
		},
    });
});

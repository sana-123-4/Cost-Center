sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    'sap/m/SearchField',
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/comp/filterbar/FilterBar",
    'sap/ui/model/type/String',
    'sap/ui/table/Column',
	'sap/m/Column',
	'sap/m/Text',
    'sap/m/Label',
],
function (Controller,Filter,FilterOperator,MessageToast,SearchField,ValueHelpDialog,JSONModel,Fragment,FilterBar,TypeString, UIColumn, MColumn, Text,Label) {
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

          onFilterChange : function(oEvent){

            // Get the SmartFilterBar instance
            var oSmartFilterBar = oEvent.getSource();

            // Retrieve filter data with applied values
            var oFilterData = oSmartFilterBar.getFilterData();

            if (oFilterData.Gjahr != null){
            var oGjahr =   oFilterData.Gjahr.value;  
            if (oGjahr == null){
            var oGjahr   = oFilterData.Gjahr.ranges[0].value1;    
            } 
            }

            var oSelectedBukrs = this.getView().byId("idBukrsSelect").getSelectedItem();
            var selBukrs = oSelectedBukrs.mProperties.key;

            var oSelect = this.getView().byId("customSelect");
              // Retrieve the selected Period item (optional, if you need the text)
            var oSelectedItem = oSelect.getSelectedItem();
            var sSelectedPeriod = oSelectedItem ? oSelectedItem.getText() : null;

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
            var that = this;
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
                    
                    if (aTokens && aTokens.length > 0) {
                        oInput.setValue(aTokens[0].getText());
                    }
                    this._oValueHelpDialog.close();
                }.bind(this),
                cancel: function () {
                    sap.m.MessageToast.show("Cancel pressed!");
                    this._oValueHelpDialog.close();
                }.bind(this),
                afterClose: function() {
                    this._oValueHelpDialog.destroy();
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
       

        onValueHelpRequested: function () {
            var oView = this.getView();
            this._oBasicSearchField = new SearchField();
           
            
            this.loadFragment({
				name: "glcostrept.glcostreport.fragments.ValueHelpDialog"
			}).then(function(oDialog) {
				var oFilterBar = oDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
				this._oVHD = oDialog;
               
				this.getView().addDependent(oDialog);

				// Set key fields for filtering in the Define Conditions Tab
				oDialog.setRangeKeyFields([{
					label: "Product",
					key: "Kostl",
					type: "string",
					typeInstance: new TypeString({}, {
						maxLength: 7
					})
			}]);

            // Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				// Trigger filter bar search when the basic search is fired
				this._oBasicSearchField.attachSearch(function() {
					oFilterBar.search();
				});

                oDialog.getTableAsync().then(function (oTable) {

                    var oODataModel = this.getView().getModel();  
					oTable.setModel(oODataModel);
                   
					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						// Bind rows to the ODataModel and add columns
						oTable.bindAggregation("rows", {
							path: "/CostCenterDataSet",
							events: {
								dataReceived: function() {
									oDialog.update();
								}
							}
						});
						oColumnProductCode = new UIColumn({label: new Label({text: "Cost Center"}), template: new Text({wrapping: false, text: "{Kostl}"})});
						oColumnProductCode.data({
							fieldName: "Kostl"
						});
						oColumnProductName = new UIColumn({label: new Label({text: "Description"}), template: new Text({wrapping: false, text: "{Ltext}"})});
						oColumnProductName.data({
							fieldName: "Ltext"
						});
						oTable.addColumn(oColumnProductCode);
						oTable.addColumn(oColumnProductName);
					}

					// For Mobile the default table is sap.m.Table
					if (oTable.bindItems) {
						// Bind items to the ODataModel and add columns
						oTable.bindAggregation("items", {
							path: "/CostCenterDataSet",
							template: new ColumnListItem({
								cells: [new Label({text: "{Kostl}"}), new Label({text: "{Ltext}"})]
							}),
							events: {
								dataReceived: function() {
									oDialog.update();
								}
							}
                    	});
						oTable.addColumn(new MColumn({header: new Label({text: "Cost Center"})}));
						oTable.addColumn(new MColumn({header: new Label({text: "Description"})}));
					}

                    oDialog.update();
				}.bind(this));
                
                oDialog.getTable().attachRowSelectionChange(function(oEvent) {
                    var oSelectedItem = oEvent.getParameter("rowContext");
                   
                });
                this._oMultiInput = this.getView().byId("inputFieldWithF4");
                oDialog.setTokens(this._oMultiInput.getTokens());
				oDialog.open();
			}.bind(this));
            
        },
        onValueHelpOkPress: function (oEvent) {
            
			var aTokens = oEvent.getParameter("tokens");
            this._oMultiInput = this.getView().byId("inputFieldWithF4");
			this._oMultiInput.setTokens(aTokens);
			this._oVHD.close();

            var KostlArr = [];
            aTokens.forEach(function (oToken) {
               
                var sKey = oToken.getKey();
                
                KostlArr.push(sKey);
            });
            
            
            var selBukrs = this.getView().byId("idBukrsSelect").getSelectedItem();
            var P_Bukrs = selBukrs.mProperties.key;

            var selPeriod = this.getView().byId("customSelect").getSelectedItem();
            var P_Period = selPeriod.mProperties.text;

            var oSmartFilterBar = this.getView().byId("smartFilterBar");
            var oFilterData = oSmartFilterBar.getFilterData();

            var oGjahr = oFilterData.Gjahr.ranges[0].value1;

            var aFilters = [];
              if(P_Bukrs){
                  aFilters.push(new Filter("Bukrs", FilterOperator.EQ, P_Bukrs));
              }
  
              if(oGjahr){
                  aFilters.push(new Filter("Gjahr", FilterOperator.EQ, oGjahr));
              }

              if(P_Period){
                aFilters.push(new Filter("Zperiod", FilterOperator.EQ, P_Period));
              }

              if(KostlArr){
                aFilters.push( new sap.ui.model.Filter({
                    path: "Kostl",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: KostlArr  // Pass the array directly
                    }) );
              }

              this.callCostChartoData(aFilters);


           
		},

		onValueHelpCancelPress: function () {
			this._oVHD.close();
		},

		onValueHelpAfterClose: function () {
			this._oVHD.destroy();
		},

        onFilterBarSearch: function (oEvent) {
			var sSearchQuery = this._oBasicSearchField.getValue(),
				aSelectionSet = oEvent.getParameter("selectionSet");

			var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
				if (oControl.getValue()) {
					aResult.push(new Filter({
						path: oControl.getName(),
						operator: FilterOperator.Contains,
						value1: oControl.getValue()
					}));
				}

				return aResult;
			}, []);

			aFilters.push(new Filter({
				filters: [
					new Filter({ path: "Kostl", operator: FilterOperator.Contains, value1: sSearchQuery }),
					new Filter({ path: "Ltext", operator: FilterOperator.Contains, value1: sSearchQuery })
				],
				and: false
			}));

			this._filterTable(new Filter({
				filters: aFilters,
				and: true
			}));
		},
        _filterTable: function (oFilter) {
			var oVHD = this._oVHD;
           
			oVHD.getTableAsync().then(function (oTable) {
               // debugger;
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter.aFilters[0].aFilters);
				}
				if (oTable.bindItems) {
					oTable.getBinding("items").filter(oFilter.aFilters[0].aFilters);
				}

				// This method must be called after binding update of the table.
				oVHD.update();
			});
		},
       
		
        onCompanyCodeValueHelpRequest : function(oEvent){
            
            var that = this;

            // Create a default token (assuming you are working with a CompanyCode for example)
            var defaultToken = new sap.m.Token({
                key: "3000", // Example key, replace with your actual default value
                text: "Jay Finechem Pvt Ltd" // Example text for the token
            });

                   // Create a ValueHelpDialog instance
                   var oValueHelpDialog = new ValueHelpDialog({
                    title: "Select Company Code",
                    supportRanges: true,
                    key: "bukrs",
                    descriptionKey: "butxt",
                    
                    ok: function (oEvent) {
                        var aTokens = oEvent.getParameter("tokens");
                        if (aTokens.length) {
                            var sCompanyCode = aTokens[0].getKey();
                            that.getView().byId("smartFilterBar").getControlByKey("Bukrs").setValue(sCompanyCode);
                        }
                        oValueHelpDialog.close();
                    },
    
                    cancel: function () {
                        oValueHelpDialog.close();
                    },
    
                    afterClose: function () {
                        oValueHelpDialog.destroy();
                    }
                });

                

                // Define the OData model to bind the dialog
                var oModel = this.getOwnerComponent().getModel();
                oValueHelpDialog.setModel(oModel);

                    // Define the columns for the ValueHelpDialog
                var oColModel = new JSONModel({
                    cols: [
                        { label: "Company Code", template: "bukrs" },
                        { label: "Company Name", template: "butxt" }
                    ]
                });

                oValueHelpDialog.getTable().setModel(oColModel, "columns");

                // Bind rows to the OData entity set (e.g., BukrsoDataSet)
                oValueHelpDialog.getTable().bindRows({
                    path: "/BukrsoDataSet",
                    parameters: {
                        select: "bukrs,butxt"
                    }
                });
                //debugger;
                // Set the default token(s)
                oValueHelpDialog.setTokens([defaultToken]);
                // Create a FilterBar with a SearchField for search functionality
            var oFilterBar = new FilterBar({
                advancedMode: false,
                search: function (oEvt) {
                    var sQuery = oSearchField.getValue();
                    that._applyFilters(oValueHelpDialog, sQuery);
                }
            });

            // Add a SearchField to the FilterBar for basic search
            var oSearchField = new SearchField({
                placeholder: "Search by Company Code or Name",
                liveChange: function (oEvent) {
                    var sQuery = oEvent.getParameter("newValue");
                    that._applyFilters(oValueHelpDialog, sQuery);
                }
            });

            oFilterBar.setBasicSearch(oSearchField);
            oValueHelpDialog.setFilterBar(oFilterBar);

            // Attach the `selectionChange` event on the dialog's internal table to capture selection changes
            oValueHelpDialog.getTable().attachRowSelectionChange(function(oEvent) {
                var oSelectedItem = oEvent.getParameter("rowContext");
                if (oSelectedItem) {
                    // Access the selected item data if needed
                    
                    var oData = oSelectedItem.getObject();

                    var selBukrs = oData.bukrs;
                    var oSelect =  that.oView.byId("customSelect");
                    // Retrieve the selected Period item (optional, if you need the text)
                    var oSelectedItem = oSelect.getSelectedItem();
                    var sSelectedPeriod = oSelectedItem ? oSelectedItem.getText() : null;
         
                    // Retrieve filter data
                    var oSmartFilterBar = that.oView.byId("smartFilterBar");
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
      
                   
                    that.callCashChartoData(aFilters);
                    that.callCostChartoData(aFilters);
                }
            });
            // Open the ValueHelpDialog
            oValueHelpDialog.open();

        },
        _applyFilters: function (oValueHelpDialog, sQuery) {
       
            var aFilters = [];
            if (sQuery) {
                aFilters.push(new Filter("bukrs", FilterOperator.Contains, sQuery));
                aFilters.push(new Filter("butxt", FilterOperator.Contains, sQuery));
            }
            var oBinding = oValueHelpDialog.getTable().getBinding("rows");
            oBinding.filter(new Filter({ filters: aFilters, and: false }), "Application");

            // Optional: Update the dialog to ensure the table reflects filters
            oValueHelpDialog.update();
        },

        onHkontValueHelpRequested : function(oEvent){
            
            var oView = this.getView();
            this._oBasicSearchField = new SearchField();
           
            this.loadFragment({
				name: "glcostrept.glcostreport.fragments.hKontValueHelpDialog"
			}).then(function(oDialog) {
				var oFilterBar = oDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
				this._oVHD = oDialog;
               
				this.getView().addDependent(oDialog);

				// Set key fields for filtering in the Define Conditions Tab
				oDialog.setRangeKeyFields([{
					label: "GL",
					key: "SAKNR",
					type: "string",
					typeInstance: new TypeString({}, {
						maxLength: 10
					})
			}]);

            // Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				// Trigger filter bar search when the basic search is fired
				this._oBasicSearchField.attachSearch(function() {
					oFilterBar.search();
				});

                oDialog.getTableAsync().then(function (oTable) {

                    var oODataModel = this.getView().getModel();  
					oTable.setModel(oODataModel);
                   
					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						// Bind rows to the ODataModel and add columns
						oTable.bindAggregation("rows", {
							path: "/GLAccDataSet",
							events: {
								dataReceived: function() {
									oDialog.update();
								}
							}
						});
						oColumnProductCode = new UIColumn({label: new Label({text: "GL Account"}), template: new Text({wrapping: false, text: "{SAKNR}"})});
						oColumnProductCode.data({
							fieldName: "SAKNR"
						});
						oColumnProductName = new UIColumn({label: new Label({text: "Description"}), template: new Text({wrapping: false, text: "{MCOD1}"})});
						oColumnProductName.data({
							fieldName: "MCOD1"
						});
						oTable.addColumn(oColumnProductCode);
						oTable.addColumn(oColumnProductName);
					}

					// For Mobile the default table is sap.m.Table
					if (oTable.bindItems) {
						// Bind items to the ODataModel and add columns
						oTable.bindAggregation("items", {
							path: "/GLAccDataSet",
							template: new ColumnListItem({
								cells: [new Label({text: "{SAKNR}"}), new Label({text: "{MCOD1}"})]
							}),
							events: {
								dataReceived: function() {
									oDialog.update();
								}
							}
                    	});
						oTable.addColumn(new MColumn({header: new Label({text: "GL Account"})}));
						oTable.addColumn(new MColumn({header: new Label({text: "Description"})}));
					}

                    oDialog.update();
				}.bind(this));
                
                oDialog.getTable().attachRowSelectionChange(function(oEvent) {
                    var oSelectedItem = oEvent.getParameter("rowContext");
                   
                });
                this._oMultiInput = this.getView().byId("hkontF4");
                oDialog.setTokens(this._oMultiInput.getTokens());
				oDialog.open();
			}.bind(this));
        },

        onHkontValueHelpOkPress: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
            this._oMultiInput = this.getView().byId("hkontF4");
			this._oMultiInput.setTokens(aTokens);
			this._oVHD.close();
		},

		onHkontValueHelpCancelPress: function () {
			this._oVHD.close();
		},

		onHkontValueHelpAfterClose: function () {
			this._oVHD.destroy();
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

        
		
    });
});

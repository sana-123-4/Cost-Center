sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(
	Controller,Filter,FilterOperator
) {
	"use strict";

	return Controller.extend("glcostrept.glcostreport.controller.ExpenseDetail", {

        onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			
			oRouter.getRoute("RouteExpenDetail").attachMatched(this._onRouteMatched, this);
			
			this.oModel = this.getOwnerComponent().getModel();
			
		},

        _onRouteMatched: function(oEvent) {

            var Kostl = oEvent.getParameter("arguments").Kostl;
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
			if(Kostl){
				aFilters.push(new Filter("Kostl", FilterOperator.EQ, Kostl));
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
        },
		onColumnSelection : function(event){

			var that = this;
			var List = that.byId("List");
			var popOver = this.byId("popOver");

			if (List !== undefined) {
				List.destroy();
			}
			if (popOver !== undefined) {
			popOver.destroy();
			}

			/*----- PopOver on Clicking ------ */
			var popover = new sap.m.Popover(this.createId("popOver"), {
				showHeader: true,
				showFooter: true,
				placement: sap.m.PlacementType.Bottom,
				content: []
			}).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");

			/*----- Adding List to the PopOver -----*/
			var oList = new sap.m.List(this.createId("List"), {});
			this.byId("popOver").addContent(oList);
			var openAssetTable = this.getView().byId("idTable"),
			columnHeader = openAssetTable.getColumns();
			var openAssetColumns = [];

			for (var i = 0; i < columnHeader.length; i++) {
				var hText = columnHeader[i].getAggregation("header").getProperty("text");
				var columnObject = {};
				columnObject.column = hText;
				openAssetColumns.push(columnObject);
			}


			var oMeta = this.oModel.getServiceMetadata();
			var headerFields = "";
			for (var i = 0; i < oMeta.dataServices.schema[0].entityType[0].property.length; i++) {
				var property = oMeta.dataServices.schema[0].entityType[0].property[i];
				headerFields += property.name + ",";
			}

			var oModel1 = new sap.ui.model.json.JSONModel({
				list: openAssetColumns});

			var itemTemplate = new sap.m.StandardListItem({
				title: "{oList>column}"
				});
			
			oList.setMode("MultiSelect");
			oList.setModel(oModel1);
			sap.ui.getCore().setModel(oModel1, "oList");

			var oBindingInfo = {
				path: 'oList>/list',
				template: itemTemplate
			};

			oList.bindItems(oBindingInfo);
			var footer = new sap.m.Bar({
			contentLeft: [],
			contentMiddle: [new sap.m.Button({
			text: "Cancel",
			press: function() {
			that.onCancel();
			}
			}),
			new sap.m.Button({
			text: "Save",
			press: function() {
			that.onSave();
			}
			})
			]
							
			});

			this.byId("popOver").setFooter(footer);
			var oList1 = this.byId("List");
			var table = this.byId("idTable").getColumns();

			/*=== Update finished after list binded for selected visible columns ==*/
			oList1.attachEventOnce("updateFinished", function() {
				var a = [];
				for (var j = 0; j < table.length; j++) {
				var list = oList1.oModels.undefined.oData.list[j].column;
				a.push(list);
				var Text = table[j].getHeader().getProperty("text");
				var v = table[j].getProperty("visible");
				if (v === true) {
				if (a.indexOf(Text) > -1) {
				var firstItem = oList1.getItems()[j];
				oList1.setSelectedItem(firstItem, true);
				}
				}
				}
			});

			popover.openBy(event.getSource());
			},

			

		
		/*================ Closing the PopOver =================*/
		onCancel: function() {
			this.byId("popOver").close();
			},

		/*============== Saving User Preferences ==================*/
		onSave: function() {
			var that = this;
			var oList = this.byId("List");
			var array = [];
			var items = oList.getSelectedItems();
	
			// Getting the Selected Columns header Text.
			for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var context = item.getBindingContext("oList");
			var obj = context.getProperty(null, context);
			var column = obj.column;
			array.push(column);
			}
			
			/*---- Displaying Columns Based on the selection of List ----*/
			var table = this.byId("idTable").getColumns();
			for (var j = 0; j < table.length; j++) {
			var Text = table[j].getHeader().getProperty("text");
			var Column = table[j].getId();
			var columnId = this.getView().byId(Column);
			if (array.indexOf(Text) > -1) {
			columnId.setVisible(true);
			} else {
			columnId.setVisible(false);
			}
			}
			
			this.byId("popOver").close();
			
			},		
		_loadODataColumns: function () {
            var that = this;
            debugger;
            // Wait for metadata to be loaded before accessing it
            this.oDataModel.attachMetadataLoaded(function () {
                // Retrieve the metadata from the OData service
                var oMetaModel = that.oDataModel.getServiceMetadata();
                var aEntityType = oMetaModel.dataServices.schema[0].entityType;

                // Find the entity type (e.g., "YourEntitySetName") to get its properties
                var oEntity = aEntityType.find(entity => entity.name === "CostDetailOdataSet");
                
                // Extract columns from metadata
                if (oEntity) {
                    var openAssetColumns = oEntity.property.map(function (oProperty) {
                        return {
                            name: oProperty.name,
                            label: oProperty["sap:label"] || oProperty.name // Fallback to name if label is not defined
                        };
                    });

                    // Create JSON model with columns list
                    var oModel1 = new JSONModel({
                        list: openAssetColumns
                    });

                    // Set JSON model to the view
                    that.getView().setModel(oModel1, "columnsModel");
        	}
		});
		}
    });

});
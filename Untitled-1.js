	onBeforeRebindTable : function(oEvent){
//debugger;
			var oBindingParams = oEvent.getParameter("bindingParams");
            var oSmartFilterBar = this.getView().byId("smartFilterBar1");

			// Get filter data from SmartFilterBar
            var oFilterData = oSmartFilterBar.getFilterData();

			var aFilters = [];

            // Add filters based on selected values in SmartFilterBar
            if (oFilterData.Bukrs) {
                aFilters.push(new Filter("Bukrs", FilterOperator.EQ, oFilterData.Bukrs.ranges[0].value1));
            }
            if (oFilterData.Gjahr) {
                aFilters.push(new Filter("Gjahr", FilterOperator.EQ, oFilterData.Gjahr.ranges[0].value1));
            }
            if (oFilterData.Kostl) {
                aFilters.push(new Filter("Kostl", FilterOperator.EQ, oFilterData.Kostl.ranges[0].value1));
            }

			oBindingParams.filters.push(aFilters);

			this._readODataWithFilters(aFilters);
		},
		_readODataWithFilters: function (aFilters) {
			var oModel = this.oModel; // OData model

			oModel.read("/CostDetailOdataSet",{
				filters: aFilters,
				success: function (oData) {
                    // Handle the successful read (e.g., bind the result to the table)
                    var oTable = this.getView().byId("idtable");
                    var oTableModel = new sap.ui.model.json.JSONModel();
                    oTableModel.setData(oData.results);
                    oTable.setModel(oTableModel);
                }.bind(this),
				error: function (oError) {
                    // Handle errors here
                    sap.m.MessageToast.show("Error while fetching data");
                }
			})
		}
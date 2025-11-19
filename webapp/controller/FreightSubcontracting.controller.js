sap.ui.define([
	"com/shipcorepro/shipcorepro/controller/BaseController",
	"com/shipcorepro/shipcorepro/controller/formatter",
	'sap/ui/model/json/JSONModel',
	'sap/m/p13n/Engine',
	'sap/m/p13n/SelectionController',
	'sap/m/p13n/SortController',
	'sap/m/p13n/GroupController',
	'sap/m/p13n/MetadataHelper',
	'sap/ui/model/Sorter',
	'sap/ui/core/library',
	'sap/m/table/ColumnWidthController',
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
	
], (BaseController, Formatter, JSONModel, Engine, SelectionController, SortController, GroupController, MetadataHelper, Sorter, CoreLibrary, ColumnWidthController,Filter,FilterOperator) => {
	"use strict";
	return BaseController.extend("com.shipcorepro.shipcorepro.controller.FreightSubcontracting", {
		Formatter: Formatter,
		onInit() {
			this.getRouter().getRoute("FreightSubcontracting").attachPatternMatched(this._onRouterFreightSubcontractingMatched, this);
		},
		_onRouterFreightSubcontractingMatched: async function () {
			const data = await this.backendCall("shipments");
			this.getModel("Subcontracting").setData(data);
			await this._registerForP13n();
		},
		
		onSelectAll: async function () {
			const oTable = this.byId("persoTable");

			const oState = await Engine.getInstance().retrieveState(oTable);
			oState.Selection = oState.Selection.map(item => {
				item.selected = true;
				return item;
			});

			await Engine.getInstance().applyState(oTable, oState);
		},

		_registerForP13n: function () {
			const oTable = this.byId("persoTable");
			this.oMetadataHelper = new MetadataHelper([
				{ key: "Actions_col", label: "Actions" }, // Action column, no data path
				{ key: "Id_col", label: "Id", path: "id" },
				{ key: "Document#_col", label: "Document#", path: "details/HeaderInfo/DocumentNumber" },
				{ key: "Date_col", label: "Date", path: "details/HeaderInfo/ShipDate" },
				{ key: "Erp_col", label: "Erp", path: "details/HeaderInfo/ERP" },
				{ key: "Tracking#_col", label: "Tracking#", path: "details/HeaderInfo/XTRACKINGNO" },
				{ key: "ShipTo_Company_col", label: "ShipTo Company", path: "details/ShipTo/COMPANY" },
				{ key: "Shipper_Country_col", label: "Shipper Country", path: "details/Shipper/COUNTRY" },
				{ key: "Carrier_col", label: "Carrier", path: "details/CarrierDetails/Carrier" },
				{ key: "ServiceName_col", label: "Service Name", path: "details/CarrierDetails/ServiceName" },
				{ key: "ShippingAccount_col", label: "Shipping Account", path: "details/CarrierDetails/ShippingAccount" },
				{ key: "Status_col2", label: "Tracking Status", path: "details/TrackingStatus" },
				{ key: "Status_col1", label: "Status", path: "details/status" },
				{ key: "FeederSystem_col", label: "Feeder System", path: "details/HeaderInfo/FeederSystem" },
				{ key: "OrderingParty_col", label: "Ordering Party", path: "details/HeaderInfo/orderingPartyLbnId" },
				{ key: "PurchasingParty_col", label: "Purchasing Party", path: "details/HeaderInfo/purchasingParty" },
				{ key: "BillFromParty_col", label: "Bill From Party", path: "details/HeaderInfo/billFromParty" },
				{ key: "SenderSystemId_col", label: "Sender System Id", path: "details/HeaderInfo/senderSystemId" },
				{ key: "Shipper_Company_col", label: "Shipper Company", path: "details/Shipper/COMPANY" },
				{ key: "Shipper_Contact_col", label: "Shipper Contact", path: "details/Shipper/CONTACT" },
				{ key: "Shipper_Address1_col", label: "Shipper Address_line1", path: "details/Shipper/ADDRESS_LINE1" },
				{ key: "Shipper_Address2_col", label: "Shipper Address_line2", path: "details/Shipper/ADDRESS_LINE2" },
				{ key: "Shipper_City_col", label: "Shipper City", path: "details/Shipper/CITY" },
				{ key: "Shipper_State_col", label: "Shipper State", path: "details/Shipper/STATE" },
				{ key: "Shipper_Zipcode_col", label: "Shipper Zipcode", path: "details/Shipper/ZIPCODE" },
				{ key: "Shipper_Phone_col", label: "Shipper Phone", path: "details/Shipper/PHONE" },
				{ key: "Shipper_Email_col", label: "Shipper Email", path: "details/Shipper/EMAIL" },
				{ key: "ShipTo_Contact_col", label: "ShipTo Contact", path: "details/ShipTo/CONTACT" },
				{ key: "ShipTo_Address1_col", label: "ShipTo Address_line1", path: "details/ShipTo/ADDRESS_LINE1" },
				{ key: "ShipTo_Address2_col", label: "ShipTo Address_line2", path: "details/ShipTo/ADDRESS_LINE2" },
				{ key: "ShipTo_City_col", label: "ShipTo City", path: "details/ShipTo/CITY" },
				{ key: "ShipTo_State_col", label: "ShipTo State", path: "details/ShipTo/STATE" },
				{ key: "ShipTo_Zipcode_col", label: "ShipTo Zipcode", path: "details/ShipTo/ZIPCODE" },
				{ key: "ShipTo_Country_col", label: "ShipTo Country", path: "details/ShipTo/COUNTRY" },
				{ key: "CarrierLbnId_col", label: "Carrier Lbn Id", path: "details/HeaderInfo/carrierLbnId" },
				{ key: "ShipTo_Phone_col", label: "ShipTo Phone", path: "details/ShipTo/PHONE" },
				{ key: "ShipTo_Email_col", label: "ShipTo Email", path: "details/ShipTo/EMAIL" },
				{ key: "ShipFrom_Company_col", label: "ShipFrom Company", path: "details/ShipFrom/COMPANY" },
				{ key: "ShipFrom_Contact_col", label: "ShipFrom Contact", path: "details/ShipFrom/CONTACT" },
				{ key: "ShipFrom_Address1_col", label: "ShipFrom Address_line1", path: "details/ShipFrom/ADDRESS_LINE1" },
				{ key: "ShipFrom_Address2_col", label: "ShipFrom Address_line2", path: "details/ShipFrom/ADDRESS_LINE2" },
				{ key: "ShipFrom_City_col", label: "ShipFrom City", path: "details/ShipFrom/CITY" },
				{ key: "ShipFrom_State_col", label: "ShipFrom State", path: "details/ShipFrom/STATE" },
				{ key: "ShipFrom_Zipcode_col", label: "ShipFrom Zipcode", path: "details/ShipFrom/ZIPCODE" },
				{ key: "ShipFrom_Country_col", label: "ShipFrom Country", path: "details/ShipFrom/COUNTRY" },
				{ key: "ShipFrom_Phone_col", label: "ShipFrom Phone", path: "details/ShipFrom/PHONE" },
				{ key: "ShipFrom_Email_col", label: "ShipFrom Email", path: "details/ShipFrom/EMAIL" },
				{ key: "SoldTo_Company_col", label: "SoldTo Company", path: "details/SoldTo/COMPANY" },
				{ key: "SoldTo_Contact_col", label: "SoldTo Contact", path: "details/SoldTo/CONTACT" },
				{ key: "SoldTo_Address1_col", label: "SoldTo Address_line1", path: "details/SoldTo/ADDRESS_LINE1" },
				{ key: "SoldTo_Address2_col", label: "SoldTo Address_line2", path: "details/SoldTo/ADDRESS_LINE2" },
				{ key: "SoldTo_City_col", label: "SoldTo City", path: "details/SoldTo/CITY" },
				{ key: "SoldTo_State_col", label: "SoldTo State", path: "details/SoldTo/STATE" },
				{ key: "SoldTo_Zipcode_col", label: "SoldTo Zipcode", path: "details/SoldTo/ZIPCODE" },
				{ key: "SoldTo_Country_col", label: "SoldTo Country", path: "details/SoldTo/COUNTRY" },
				{ key: "SoldTo_Phone_col", label: "SoldTo Phone", path: "details/SoldTo/PHONE" },
				{ key: "SoldTo_Email_col", label: "SoldTo Email", path: "details/SoldTo/EMAIL" },
				{ key: "Items_col", label: "Items Count", path: "details/Items" },
				{ key: "Packages_col", label: "Packages Count", path: "details/Packages" },
				{ key: "ItemInfo_col", label: "Int. Item Info", path: "details/InternationalDetails/ItemInfo" },
				{ key: "PaymentType_col", label: "Payment Type", path: "details/CarrierDetails/PaymentType" },
				{ key: "UserId_col", label: "User Id", path: "details/CarrierDetails/UserId" },
				{ key: "Password_col", label: "Password", path: "details/CarrierDetails/Password" },
				{ key: "AccessKey_col", label: "Access Key", path: "details/CarrierDetails/AccessKey" },
				{ key: "ShippingCharges_col", label: "Shipping Charges", path: "details/shippingCharges" },
				{ key: "ShippingDocuments_col", label: "Shipping Documents", path: "details/shippingDocuments" }
			]);

			// Define initial widths for all columns
			this._mIntialWidth = {
				"Actions_col": "6rem",
				"Id_col": "11rem",
				"Document#_col": "11rem",
				"Date_col": "11rem",
				"Erp_col": "11rem",
				"Tracking#_col": "11rem",
				"ShipTo_Company_col": "11rem",
				"Shipper_Country_col": "11rem",
				"Carrier_col": "11rem",
				"ServiceName_col": "11rem",
				"ShippingAccount_col": "11rem",
				"Status_col2": "11rem",
				"Status_col1": "11rem",
				"FeederSystem_col": "11rem",
				"OrderingParty_col": "11rem",
				"PurchasingParty_col": "11rem",
				"BillFromParty_col": "11rem",
				"SenderSystemId_col": "11rem",
				"Shipper_Company_col": "11rem",
				"Shipper_Contact_col": "11rem",
				"Shipper_Address1_col": "11rem",
				"Shipper_Address2_col": "11rem",
				"Shipper_City_col": "11rem",
				"Shipper_State_col": "11rem",
				"Shipper_Zipcode_col": "11rem",
				"Shipper_Phone_col": "11rem",
				"Shipper_Email_col": "11rem",
				"ShipTo_Contact_col": "11rem",
				"ShipTo_Address1_col": "11rem",
				"ShipTo_Address2_col": "11rem",
				"ShipTo_City_col": "11rem",
				"ShipTo_State_col": "11rem",
				"ShipTo_Zipcode_col": "11rem",
				"ShipTo_Country_col": "11rem",
				"CarrierLbnId_col": "11rem",
				"ShipTo_Phone_col": "11rem",
				"ShipTo_Email_col": "11rem",
				"ShipFrom_Company_col": "11rem",
				"ShipFrom_Contact_col": "11rem",
				"ShipFrom_Address1_col": "11rem",
				"ShipFrom_Address2_col": "11rem",
				"ShipFrom_City_col": "11rem",
				"ShipFrom_State_col": "11rem",
				"ShipFrom_Zipcode_col": "11rem",
				"ShipFrom_Country_col": "11rem",
				"ShipFrom_Phone_col": "11rem",
				"ShipFrom_Email_col": "11rem",
				"SoldTo_Company_col": "11rem",
				"SoldTo_Contact_col": "11rem",
				"SoldTo_Address1_col": "11rem",
				"SoldTo_Address2_col": "11rem",
				"SoldTo_City_col": "11rem",
				"SoldTo_State_col": "11rem",
				"SoldTo_Zipcode_col": "11rem",
				"SoldTo_Country_col": "11rem",
				"SoldTo_Phone_col": "11rem",
				"SoldTo_Email_col": "11rem",
				"Items_col": "11rem",
				"Packages_col": "11rem",
				"ItemInfo_col": "11rem",
				"PaymentType_col": "11rem",
				"UserId_col": "11rem",
				"Password_col": "11rem",
				"AccessKey_col": "11rem",
				"ShippingCharges_col": "11rem",
				"ShippingDocuments_col": "11rem"
			};

			// Register the table with the P13n Engine
			Engine.getInstance().register(oTable, {
				helper: this.oMetadataHelper,
				controller: {
					Columns: new SelectionController({
						targetAggregation: "columns",
						control: oTable
					}),
					Sorter: new SortController({
						control: oTable
					}),
					Groups: new GroupController({
						control: oTable
					}),
					ColumnWidth: new ColumnWidthController({
						control: oTable
					})
				}
			});
			Engine.getInstance().attachStateChange(this.handleStateChange, this);
		},

		openPersoDialog: function (oEvt) {

			const oTable = this.byId("persoTable");

			Engine.getInstance().show(oTable, ["Columns", "Sorter"], {
				contentHeight: "35rem",
				contentWidth: "32rem",
				source: oEvt.getSource()
			});
		},
		onColumnHeaderItemPress: function (oEvt) {
			const oTable = this.byId("persoTable");
			const sPanel = oEvt.getSource().getIcon().indexOf("sort") >= 0 ? "Sorter" : "Columns";
			Engine.getInstance().show(oTable, [sPanel], {
				contentHeight: "35rem",
				contentWidth: "32rem",
				source: oTable
			});
		},

		onSort: function (oEvt) {

			const oTable = this.byId("persoTable");
			const sAffectedProperty = this._getKey(oEvt.getParameter("column"));
			const sSortOrder = oEvt.getParameter("sortOrder");

			//Apply the state programatically on sorting through the column menu
			//1) Retrieve the current personalization state
			Engine.getInstance().retrieveState(oTable).then(function (oState) {

				//2) Modify the existing personalization state --> clear all sorters before
				oState.Sorter.forEach(function (oSorter) {
					oSorter.sorted = false;
				});
				oState.Sorter.push({
					key: sAffectedProperty,
					descending: sSortOrder === CoreLibrary.SortOrder.Descending
				});

				//3) Apply the modified personalization state to persist it in the VariantManagement
				Engine.getInstance().applyState(oTable, oState);
			});
		},

		onColumnMove: function (oEvt) {

			const oTable = this.byId("persoTable");
			const oAffectedColumn = oEvt.getParameter("column");
			const iNewPos = oEvt.getParameter("newPos");
			const sKey = this._getKey(oAffectedColumn);
			oEvt.preventDefault();

			Engine.getInstance().retrieveState(oTable).then(function (oState) {

				const oCol = oState.Columns.find(function (oColumn) {
					return oColumn.key === sKey;
				}) || {
					key: sKey
				};
				oCol.position = iNewPos;

				Engine.getInstance().applyState(oTable, {
					Columns: [oCol]
				});
			});
		},

		_getKey: function (oControl) {

			return oControl.data("p13nKey");
		},

		handleStateChange: function (oEvt) {

			const oTable = this.byId("persoTable");
			const oState = oEvt.getParameter("state");

			if (!oState) {
				return;
			}

			oTable.getColumns().forEach(function (oColumn) {

				const sKey = this._getKey(oColumn);
				const sColumnWidth = oState.ColumnWidth[sKey];

				oColumn.setWidth(sColumnWidth || this._mIntialWidth[sKey]);

				oColumn.setVisible(false);
				oColumn.setSortOrder(CoreLibrary.SortOrder.None);
			}.bind(this));

			oState.Columns.forEach(function (oProp, iIndex) {
				const oCol = this.byId("persoTable").getColumns().find((oColumn) => oColumn.data("p13nKey") === oProp.key);
				oCol.setVisible(true);

				oTable.removeColumn(oCol);
				oTable.insertColumn(oCol, iIndex);
			}.bind(this));

			const aSorter = [];
			oState.Sorter.forEach(function (oSorter) {
				const oColumn = this.byId("persoTable").getColumns().find((oColumn) => oColumn.data("p13nKey") === oSorter.key);
				/** @deprecated As of version 1.120 */
				oColumn.setSorted(true);
				oColumn.setSortOrder(oSorter.descending ? CoreLibrary.SortOrder.Descending : CoreLibrary.SortOrder.Ascending);
				aSorter.push(new Sorter(this.oMetadataHelper.getProperty(oSorter.key).path, oSorter.descending));
			}.bind(this));
			oTable.getBinding("rows").sort(aSorter);
		},

		onColumnResize: function (oEvt) {

			const oColumn = oEvt.getParameter("column");
			const sWidth = oEvt.getParameter("width");
			const oTable = this.byId("persoTable");

			const oColumnState = {};
			oColumnState[this._getKey(oColumn)] = sWidth;

			Engine.getInstance().applyState(oTable, {
				ColumnWidth: oColumnState
			});
		},
		//  onSearch: function () {
		// 	debugger
        //     var that = this
        //     var oFilterbar = this.byId("filterbar")
        //     var aFilterItems = oFilterbar.getAllFilterItems();
        //     var aFilters = []

        //     aFilterItems.forEach((aFilterItem) => {
        //         var sPropertyName = aFilterItem.getName();
        //         var sValue = aFilterItem.getControl().getValue();
		// 		var oFilter = new Filter(sPropertyName, "Contains", sValue);
        //         aFilters.push(oFilter);
        //     });
        //     var oTable = this.byId("persoTable");
        //     var oBinding = oTable.getBinding("rows");
        //     // let aFilter = [new Filter({
        //     //     filters: aFilters,
        //     //     and: false
        //     // })]
        //     oBinding.filter(aFilters);
        // }
		onSearch: function () {
    debugger;
    let oFilterbar = this.byId("filterbar");
    let aFilterItems = oFilterbar.getAllFilterItems();
    let aFilters = [];

    aFilterItems.forEach((oFilterItem) => {

        let sPath = oFilterItem.getName();               // Field name
        let oControl = oFilterItem.getControl();         // Input control
        let vValue = oControl.getValue?.() || oControl.getSelectedKey?.();

        if (vValue === "" || vValue === null || vValue === undefined) {
            return; // Skip empty filters
        }

        // -----------------------------
        // Detect data type dynamically
        // -----------------------------
        let oFilter;

        // 1️⃣ NUMBER
        if (!isNaN(vValue) && vValue !== "" && vValue !== null) {
            oFilter = new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.EQ, Number(vValue));
        }

        // 2️⃣ DATE (from DatePicker)
        else if (oControl instanceof sap.m.DatePicker) {
            let oDate = oControl.getDateValue();
            if (oDate) {
                oFilter = new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.EQ, oDate);
            }
        }

        // 3️⃣ BOOLEAN (Switch / Select)
        else if (vValue === "true" || vValue === "false") {
            oFilter = new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.EQ, vValue === "true");
        }

        // 4️⃣ STRING (default = Contains)
        else if (typeof vValue === "string") {
            oFilter = new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.Contains, vValue);
        }

        // Add filter if created
        if (oFilter) {
            aFilters.push(oFilter);
        }
    });

    // Apply Filters
    let oTable = this.byId("persoTable");
    let oBinding = oTable.getBinding("rows");
    oBinding.filter(aFilters); // AND filter
}

	});
});
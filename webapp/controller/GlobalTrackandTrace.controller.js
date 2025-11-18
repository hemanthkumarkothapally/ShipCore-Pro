sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/shipcorepro/shipcorepro/controller/BaseController"

], (Controller, BaseController) => {
    "use strict";

    return BaseController.extend("com.shipcorepro.shipcorepro.controller.GlobalTrackandTrace", {
        onInit() {
            this.getRouter().getRoute("GlobalTrackandTrace").attachPatternMatched(this._onRouterGlobalTrackandTraceMatched, this);

        },
        _onRouterGlobalTrackandTraceMatched: function () {
            const sUrl = "https://shipv2_xcservices.cfapps.eu10-004.hana.ondemand.com/formOperations/saptrack";
            const sToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidmVua2F0IiwiTG9jYXRpb25JZCI6IjEiLCJSb2xlIjoiU3lzdGVtQWRtaW4iLCJpYXQiOjE3NjM0NzYwNDEsImV4cCI6MTc2MzQ4MzI0MX0.u1EPXoNmmZ9PSKdBssbD-s4Kzyn4Af6KdQcgMx6jVmE"
            fetch(sUrl, {
                method: "GET",
                headers: {
                    "X-Token": sToken,
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(data => {
                    var oModelData = {
                        Fetched: data // 'data' here refers to the array from your fetch
                    };
                    var oModel = new sap.ui.model.json.JSONModel(oModelData);
                    this.getView().setModel(oModel, "GlobalTrackandTraceModel");
                    console.log("GlobalTrackandTraces:", data);
                })
                .catch(err => {
                    console.error("API error:", err);
                });
        },
        normalizeCarrier: function (carrier) {
            if (!carrier) return "";
            let Uppercarrier = carrier.replace(/\s+/g, "").toUpperCase();
            var oHBox = this.byId("idCarrierTag");
            if (oHBox) {
                if (carrier) {

                    oHBox.addStyleClass(Uppercarrier);
                }
            }
            return Uppercarrier;
        },
        normalizeCarrierStatus: function (CarrierStatus) {
            if (CarrierStatus === "DELIVERED") {
                return 'Success'
            } else if (CarrierStatus === "READY FOR PICKUP") {
                return 'Information'
            }
        },
        onViewTrackingDetails: function (oEvent) {
            if (!this._TrackingDetailsDialog) {
                this._TrackingDetailsDialog = this.loadFragments("com.shipcorepro.shipcorepro.fragments.TrackingDetails")
            }
            this._TrackingDetailsDialog.then(function (oDialog) {
                oDialog.open();
            }); var oButton = oEvent.getSource();
            var oBindingContext = oButton.getBindingContext("GlobalTrackandTraceModel"); // Specify the model name

            if (oBindingContext) {
                var oRowData = oBindingContext.getObject().details.trackingEvents;
                this.getView().getModel("GlobalTrackandTraceModel").setProperty("/SelectedTrakingEvents", oRowData);
                console.log(
                    this.getView().getModel("GlobalTrackandTraceModel").getData());
            } else {
                console.warn("Could not retrieve binding context for the pressed button.");
            }
        },
        onCancelPress: function () {
            this._TrackingDetailsDialog.then(function (oDialog) {
                oDialog.close();
            });
        }
    });
});
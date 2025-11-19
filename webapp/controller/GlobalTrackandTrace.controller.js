sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/shipcorepro/shipcorepro/controller/BaseController"

], (Controller, BaseController) => {
    "use strict";

    return BaseController.extend("com.shipcorepro.shipcorepro.controller.GlobalTrackandTrace", {
        onInit() {
            this.getView().byId("gttTable").setBusy(true);

            this.getRouter().getRoute("GlobalTrackandTrace").attachPatternMatched(this._onRouterGlobalTrackandTraceMatched, this);

        },
        _onRouterGlobalTrackandTraceMatched: function () {
            this.SelectedId;
            const sUrl = "https://shipv2_xcservices.cfapps.eu10-004.hana.ondemand.com/formOperations/saptrack";
            const sToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidmVua2F0IiwiTG9jYXRpb25JZCI6IjEiLCJSb2xlIjoiU3lzdGVtQWRtaW4iLCJpYXQiOjE3NjM1NTE4NTIsImV4cCI6MTc2MzU1OTA1Mn0.yI4z4SnAa8mZRY1usmpf-eemWsvNHAC_hiMzr39YCPw"
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
                        Fetched: data, // 'data' here refers to the array from your fetch
                        logs: [],
                        selecteddata: {}
                    };
                    var oModel = new sap.ui.model.json.JSONModel(oModelData);
                    this.getView().setModel(oModel, "GlobalTrackandTraceModel");
                    console.log("GlobalTrackandTraces:", data);
                    this.getView().byId("gttTable").setBusy(false);
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
        formatCarrierStatus: function (status) {

            if (status.toUpperCase() === 'UPS') return "Warning";
            else if (status.toUpperCase() === 'FEDEX') return "Information";
            else if (status.toUpperCase() === "RL") return "Success";
            else return "None";
        },
        formatCarrierRefs: function (aRefs) {
            if (!aRefs) { return ""; }
            if (Array.isArray(aRefs)) {
                return aRefs.map(function (o) {
                    return o.referenceId || o.ref || o.name || JSON.stringify(o);
                }).join(", ");
            }
            if (typeof aRefs === "object") {
                return aRefs.referenceId || JSON.stringify(aRefs);
            }
            return String(aRefs);
        },
        getEventNumber: function(aEvents, oCurrentEvent) {
    if (aEvents && oCurrentEvent) {
        var iIndex = aEvents.indexOf(oCurrentEvent);
        return "Event #" + (iIndex + 1);
    }
    return "Event #";
},
        onViewTrackingDetails: function (oEvent) {
                                this.getView().setBusy(true);

            var oButton = oEvent.getSource();
            var oBindingContext = oButton.getBindingContext("GlobalTrackandTraceModel"); // Specify the model name

            if (oBindingContext) {
                var oRowData = oBindingContext.getObject().details.trackingEvents;
                this.SelectedId = oBindingContext.getObject().id;
                this.getView().getModel("GlobalTrackandTraceModel").setProperty("/selecteddata", oBindingContext.getObject().details);
                this.getView().getModel("GlobalTrackandTraceModel").setProperty("/SelectedTrakingEvents", oRowData);
                console.log(
                    this.getView().getModel("GlobalTrackandTraceModel").getData());
            } else {
                console.warn("Could not retrieve binding context for the pressed button.");
            }
            if (!this._TrackingDetailsDialog) {
                this._TrackingDetailsDialog = this.loadFragments("com.shipcorepro.shipcorepro.fragments.TrackingDetails")
            }
            this._TrackingDetailsDialog.then(function (oDialog) {
                oDialog.open();
                
            }); 
            this.getView().setBusy(false);
        },
        onCancelPress: function () {
            this._TrackingDetailsDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onTrackingDetailsFilterpress:function(){
            if (!this._TrackingDetailsFilterDialog) {
                this._TrackingDetailsFilterDialog = this.loadFragments("com.shipcorepro.shipcorepro.fragments.TrackingDetailsFilter")
            }
            this._TrackingDetailsFilterDialog.then(function (oDialog) {
                oDialog.open();
            }); 
        },
        onLoadLogsPress: function () {
            const sUrl = "https://shipv2_xcservices.cfapps.eu10-004.hana.ondemand.com/logs/SAPTrack/" + this.SelectedId;
            const sToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidmVua2F0IiwiTG9jYXRpb25JZCI6IjEiLCJSb2xlIjoiU3lzdGVtQWRtaW4iLCJpYXQiOjE3NjM1NTE4NTIsImV4cCI6MTc2MzU1OTA1Mn0.yI4z4SnAa8mZRY1usmpf-eemWsvNHAC_hiMzr39YCPw"
            fetch(sUrl, {
                method: "GET",
                headers: {
                    "X-Token": sToken,
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(data => {
                    this.getView().getModel("GlobalTrackandTraceModel").setProperty("/logs", data);
                    console.log("logs:", data);
                })
                .catch(err => {
                    console.error("API error:", err);
                });
        }
    });
});
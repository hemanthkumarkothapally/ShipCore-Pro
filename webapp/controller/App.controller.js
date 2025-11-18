sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "com/shipcorepro/shipcorepro/controller/BaseController"
], (Controller,BaseController) => {
  "use strict";

  return BaseController.extend("com.shipcorepro.shipcorepro.controller.App", {
      onInit() {
      },
      onItemSelect: function (oEvent) {
            const oItem = oEvent.getParameter("item");
            const sKey = oItem.getKey();
            this.getOwnerComponent().getRouter().navTo(sKey)
      }
      
  });
});
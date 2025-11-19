sap.ui.define([
], function () {
    "use strict";
    return {
        formatCarrierStatus: function (status) {
            
            if (status === 'UPS') return "Warning";
            else if (status === 'FedEx') return "Information";
            else if (status === "RL") return "Success";
            else return "None";
        },
        formatShippingCharges: function (value) {
            
            if (value === null || value === undefined) {
                return "";
            }

            // If object or array → stringify
            if (typeof value === "object") {
                try {
                    return JSON.stringify(value);

                } catch (e) {
                    return "";
                }
            }

            // Primitive → return as is
            return value;
        }

    };
});
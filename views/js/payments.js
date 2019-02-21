
paypal.Buttons({
    createOrder: function (data, actions) {
        // Set up the transaction
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: document.getElementById("sum").innerHTML
                }
            }]
        });
    },
    onApprove: function (data, actions) {
        // Capture the funds from the transaction
        return actions.order.capture().then(function (details) {
            // Show a success message to your buyer
            alert('Transaction completed by ' + details.payer.name.given_name);
            return fetch('/paypal-transaction-complete', {
                method: 'post',
                body: JSON.stringify({
                    orderID: data.orderID
                })
            });
        });
    }
}).render('#paypal-button-container');
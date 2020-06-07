const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

function client() {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

function environment() {
    let clientId = process.env.PAYPAL_CLIENT_ID || 'PAYPAL-SANDBOX-CLIENT-ID';
    let clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'PAYPAL-SANDBOX-CLIENT-SECRET';

    return new checkoutNodeJssdk.core.SandboxEnvironment(
        clientId, clientSecret
    );
}

async function prettyPrint(jsonData, pre=""){
    let pretty = "";
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    for (let key in jsonData){
        if (jsonData.hasOwnProperty(key)){
            if (isNaN(key))
              pretty += pre + capitalize(key) + ": ";
            else
              pretty += pre + (parseInt(key) + 1) + ": ";
            if (typeof jsonData[key] === "object"){
                pretty += "\n";
                pretty += await prettyPrint(jsonData[key], pre + "    ");
            }
            else {
                pretty += jsonData[key] + "\n";
            }

        }
    }
    return pretty;
}

function parseSingleOriginalError(error) {
    let result = {
        error: '',
        description: 'An error occured. Please try again.'
    }
    if(error._originalError) {
        try {
            originalErrBody = JSON.parse(error._originalError.text)
        } catch (e) {
            originalErrBody = error._originalError.text
        }

        if ((typeof originalErrBody) === 'object' ) {
            if (originalErrBody.details && originalErrBody.details.length > 0 ) {
                return result = {
                    error: originalErrBody.details[0].issue || '',
                    description: originalErrBody.details[0].description || ''
                }
            }
        } else {
            result.error = originalErrBody
        }
    }
    return result
}

module.exports = { client, prettyPrint, parseSingleOriginalError } ;
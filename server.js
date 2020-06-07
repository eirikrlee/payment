
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser')
const payPalClient  = require('./http/paypal')
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const app = express();

app.use(bodyParser.json())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.send('Welcome to Eric\'s app!');
});

app.post('/api/orders', async (req, res) => {

  const { value } = req.body
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  // request.headers['PayPal-Mock-Response'] = JSON.stringify({mock_application_codes:'ITEM_TOTAL_MISMATCH'})
  request.prefer("return=representation");
  
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'HKD',
        value
      }
    }]
  });

  let order;
  try {
    order = await payPalClient.client().execute(request);
  } catch (err) {
    const result = payPalClient.parseSingleOriginalError(err)
    return res.status(err.statusCode).json(result);
  }

  res.status(200).json({
    orderID: order.result.id
  });
});


app.post('/api/capture-paypal-transaction', async (req, res) => {

  const { orderID } = req.body
  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
  const mockApplicationCode = req.get('MOCK-APPLICATION-CODE')
  if (mockApplicationCode) {
    request.headers['PayPal-Mock-Response'] = JSON.stringify({mock_application_codes: mockApplicationCode})
  }
  let result = {}

  request.requestBody({});
  
  try {
    const { result: { id, status} } = await payPalClient.client().execute(request);
    result = {
      orderID: id,
      status
    }

  } catch (err) {
    const result = payPalClient.parseSingleOriginalError(err)

    return res.status(500).json(result);
  }

  res.json(result);
});



// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
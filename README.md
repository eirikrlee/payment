## issues 

negative testing header doesn't work
cannot simulate insufficient funds with sandbox account
  - if have credit card, it will always use it
  - if not have credit card, it will always ask me to add one


### next to do
- create order from the server instead of using - DONE
        return actions.order.create({
        purchase_units: [{
          amount: {
            value: '0.01'
          }
        }] 
- negative testing on failure about - DONE
- input box for variable charge in checkout.html
- handle /orders error
-  express generic error

### Notes

- https://developer.paypal.com/docs/archive/nvp-soap-api/errors/#17000-to-17099
- https://developer.paypal.com/docs/api-basics/sandbox/error-conditions/#test-api-error-handling-routines

### accounts

personal_acct=ericleetest@gmail.com
personal_password=Paypal2020!
ericleetest2@gmail.com
Paypal2020!!
ericleetest3@gmail.com
Paypal2020!!!
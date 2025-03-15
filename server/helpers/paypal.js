const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: process.env.PAYPAL_MODE || "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID || "AfCBS4IsMLree9Rxr0g5r3ZsUfZXx0SqfPALcl7TWqJk9BwA_itTA1yxsU1igY9hHyA9UIYxoC3BkRk4",
  client_secret: process.env.PAYPAL_CLIENT_SECRET || "ECpQUD3pBxzSBKZ6LZSBueE1Qmi8plmwDCxaKrvirKZ4mnRgchDF2z3wxOhljhOvD4hqJ63Sk5BBremc"
});

module.exports = paypal;

const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: process.env.PAYPAL_MODE || "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID || "your_client_id_here",
  client_secret: process.env.PAYPAL_CLIENT_SECRET || "your_secret_here"
});

module.exports = paypal;

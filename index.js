require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const userHandler = require("./routeHandler/userHandler");
const eventHandler = require("./routeHandler/eventHandler");
const bookingHandler = require("./routeHandler/bookingHandler");
const SSLCommerzPayment = require('sslcommerz-lts');
const verifyLogin = require("./middlewares/verifyLogin");

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
  };
  

const app = express();
app.use(cors(corsOptions));  // Apply CORS middleware to all routes
app.use(bodyParser.json());
app.use(express.json());

const port = 5000;
const uri = process.env.MONGO_URI;

// SSLCOMMERZ
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; // true for live, false for sandbox

// Database connection with mongoose
mongoose.connect(uri)
    .then(() => console.log("Connection successful"))
    .catch(err => console.log(err));

// Error handling
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err });
};
app.use(errorHandler);



// Application routes
app.use("/user", userHandler);
app.use("/event", eventHandler);
app.use("/booking", bookingHandler);

// SSLCommerz payment initiation
app.get('/init', (req, res) => {
    const data = {
        total_amount: 100,
        currency: 'BDT',
        tran_id: 'req.tran_id', // use unique tran_id for each api call
        success_url: 'http://localhost:3030/success',
        fail_url: 'http://localhost:3030/fail',
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.redirect(GatewayPageURL)
        console.log('Redirecting to: ', GatewayPageURL)
    });
})

// SSLCommerz IPN handler
app.post("/sslcommerz/ipn", (req, res) => {
    const { status, tran_id, val_id, amount, store_amount, card_type, card_no, currency, bank_tran_id, txn_id, verify_sign, verify_key, risk_level, risk_title } = req.body;

    // Validate the IPN and update the order status in your database

    res.status(200).json({ message: "IPN received" });
});

app.get('/', (req, res) => {
    res.send("Route is working");
});

app.listen(port, () => {
    console.log("App is listening on port:", port);
});

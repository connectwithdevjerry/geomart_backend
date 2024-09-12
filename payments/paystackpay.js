const https = require("https");
require("dotenv").config();

const payWithPaystack = (email, amount) => {
  return new Promise((resolve, reject) => {
    const params = JSON.stringify({
      email,
      amount,
    });

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const req = https
      .request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(JSON.parse(data));
        });
      })
      .on("error", (error) => {
        console.error(error);
        reject({ status: false, message: error.message });
      });

    req.write(params);
    req.end();
  });
};

const paymentStatus = (refrence) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: `/transaction/verify/${refrence}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    };

    https
      .request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          console.log(JSON.parse(data));
          resolve(JSON.parse(data));
        });
      })
      .on("error", (error) => {
        console.error(error);
        reject({ status: false, message: error.message });
      });
  });
};

module.exports = { payWithPaystack, paymentStatus };

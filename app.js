const express = require("express");//external module
const https = require("https");//native module
let callToAPI = false

const app = express();
let myrates = "";
let myResults = {
     results: {
        base: "",
        date: "",
        rates: {
    
        }
    }
};

app.get("/", function(req, res) {
    res.send("visit: api/rates to get the latest exchange rate")
});

app.get("/api/rates", function(req, res) {
    if (!req.query.base || !req.query.currency) { // user did not include the base and currency queries
        res.send("<p style='color:red'>Get request failed because you did not provide the 'base' and 'currency' parameters</p>");
    } else {
        let base = req.query.base;
        let currency = req.query.currency;
        // currency = currency.split(",");
        let url = "https://api.exchangeratesapi.io/latest?base=" + base + "&symbols=" + currency
        https.get(url, function(response) {
            if (response.statusCode === 200) {
                callToAPI = true;
                response.on("data", function(data) {
                    const buffer = JSON.parse(data);
                    myrates = buffer;
                })
            }
        });

    }
    if (callToAPI) {
        myResults.results.base = myrates.base;
        myResults.results.date = myrates.date
        myResults.results.rates = myrates.rates;
        let myResultsInjson = JSON.stringify(myResults);
        res.send(myResultsInjson);
    } else {
        res.send("<p style='color:red'>Get request failed, please check your url and try again</p>")
    }

});


app.listen(process.env.PORT || 3000, function() {
    console.log("app is running on port 3000");
});
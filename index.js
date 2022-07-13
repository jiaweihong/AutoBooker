const express = require('express');
const bodyParser = require('body-parser');
const bookActivity = require('./bookActivity.js')

const app = express();
const port = process.env.PORT || 3000;

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/bookActivity', async (req, res) => {
    await bookActivity();
    res.send("booked");
})


app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`);
})



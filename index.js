const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("hi");
})


app.listen(port, () => {
    console.log(`server listening on localhost:${port}`);
})



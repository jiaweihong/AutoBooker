const express = require('express');
const bodyParser = require('body-parser');
const bookActivity = require('./bookActivity.js')
const pool = require('./db.js');

const app = express();
const port = process.env.PORT || 3001;

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/bookActivity', async (req, res) => {
    await bookActivity();
    res.send("booked");
})

app.post('/api/to_book', async (req, res) => {
    try {
        const {sportsCentre} = req.body;
        const {activity} = req.body;
        const {activityDay} = req.body;
        const {activityMonth} = req.body;
        const {activityYear} = req.body;
        const {activityHour} = req.body;
    
        const toBook = await pool.query(`INSERT INTO to_book(sports_centre, activity, activity_day, activity_month, activity_year, activity_hour) VALUES (${sportsCentre}, ${activity}, ${activityDay}, ${activityMonth}, ${activityYear}, ${activityHour} RETURNING *`);

        res.json(toBook.rows[0]);
    } catch (error) {
        console.error(error);
    }
})

app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`);
})



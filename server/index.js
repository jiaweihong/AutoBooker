const express = require('express');
const bodyParser = require('body-parser');
const bookActivity = require('./bookActivity.js')
const pool = require('./db.js');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/api/bookings', async (req, res) => {
    try {
        const allToBooks = await pool.query(`SELECT * FROM to_book`);

        res.json(allToBooks.rows);
    } catch (error) {
        
    }
})

app.post('/api/bookings', async (req, res) => {
    try {
        const {username} = req.body;
        const {password} = req.body;
        const {sportsCentre} = req.body;
        const {activity} = req.body;
        const {activityDay} = req.body;
        const {activityMonth} = req.body;
        const {activityYear} = req.body;
        const {activityHour} = req.body;
        
        const addToBook = await pool.query(`INSERT INTO to_book(username, password, sports_centre, activity, activity_day, activity_month, activity_year, activity_hour) VALUES ('${username}', '${password}', '${sportsCentre}', '${activity}', ${activityDay}, ${activityMonth}, ${activityYear}, ${activityHour}) RETURNING *`);

        res.json(addToBook.rows[0]);
    } catch (error) {
        console.error(error);
    }
})

app.put('/api/bookings/:id', async (req,res) => {
    try {
        const {id} = req.params;
        const {sportsCentre} = req.body;
        const {activity} = req.body;
        const {activityDay} = req.body;
        const {activityMonth} = req.body;
        const {activityYear} = req.body;
        const {activityHour} = req.body;

        const updateToBook = await pool.query(`UPDATE to_book SET sports_centre = '${sportsCentre}', activity = '${activity}', activity_day = ${activityDay}, activity_month = ${activityMonth}, activity_year = ${activityYear}, activity_hour = ${activityHour} WHERE to_book_id = ${id}`);

        res.json("Booking updated");
    } catch (error) {
        console.error(error);
    }
})

app.delete('/api/bookings/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const deleteToBook = await pool.query(`DELETE FROM to_book WHERE to_book_id = ${id}`);
    
        res.json("Succesfully deleted");
    } catch (error) {
        console.error(error);
    }
})

app.get('/api/ex_booking/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const booking = await pool.query(`SELECT * FROM to_book WHERE to_book_id = ${id}`);

        await bookActivity(booking.rows[0]);

        console.log("done");
    } catch (error) {
        console.error(error);
    }
})


app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`);
})



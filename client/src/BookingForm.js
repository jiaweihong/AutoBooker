import React, { useState } from 'react'
import CryptoJs from 'crypto-js';
import DateTimePicker from 'react-datetime-picker';

const BookingForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [sportsCentre, setSportsCentre] = useState('David Ross');
    const [activity, setActivity] = useState('Volleyball - Hall C/D')
    const [dateTime, setDateTime] = useState(new Date());
    dateTime.setMinutes(0);

    let davidRossActivities = ["Volleyball - Hall C/D"];
    let jubileeCampusActivities = ["Volleyball - Hall 1"];
    let dropdownActivies = null;
    let activityOptions = null;

    if (sportsCentre === "David Ross"){
        dropdownActivies = davidRossActivities;
    } else if (sportsCentre === "Jubilee Campus") {
        dropdownActivies = jubileeCampusActivities;
    }

    if (dropdownActivies != null){
        activityOptions = dropdownActivies.map((activity) => <option key={activity} value={activity}> {activity} </option>);
    }

    const encryptPassword = (password) => {
        var ciphertext = CryptoJs.AES.encrypt(password, process.env.REACT_APP_ENCRYPTION_SECRET);
        let encryptedPassword = ciphertext.toString();
        return encryptedPassword; 
    }

    const submitForm = async (e) => {
        e.preventDefault();

        let encryptedPassword = encryptPassword(password);
        try {
            const body = {
                username: username,
                password: encryptedPassword,
                sportsCentre: sportsCentre,
                activity: activity,
                activityDay: dateTime.getDay(),
                activityMonth: dateTime.getMonth(),
                activityYear: dateTime.getFullYear(),
                activityHour: dateTime.getHours()
            }

            const res = await fetch("http://localhost:3000/api/bookings", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            })

            console.log(res);
        } catch (error) {
            console.error(error);
        }
    }


  return (
    <form onSubmit={submitForm}>
        <label>
            Username
        </label>
        <input 
            required 
            placeholder='Not email' 
            type='text' 
            value={username} 
            onChange={(e) => {setUsername(e.target.value)}}
        />

        <label>
            Password
        </label>
        <input 
            required
            type='text'
            value={password}
            onChange={(e) => {setPassword(e.target.value)}}
        >
        </input>

        <label>
            Sport Centre
        </label>
        <select
            value={sportsCentre}
            onChange={(e) => {setSportsCentre(e.target.value)}}
        >
            <option value="David Ross">David Ross</option>
            <option value="Jubilee Campus">Jubilee Campus</option>
        </select>

        <label>
            Activity
        </label>
        <select
            value={activity}
            onChange={(e) => {setActivity(e.target.value)}}
        >
            {activityOptions}
        </select>

        <label>
            Date
        </label>
        <DateTimePicker onChange={setDateTime} value={dateTime} />

        <button type="submit">Submit</button>
    </form>
  )
}

export default BookingForm;

import React, { useState } from 'react'
import CryptoJs from 'crypto-js';
import DateTimePicker from 'react-datetime-picker';

export default function Form(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [sportCentre, setSportCentre] = useState('');
    const [activity, setActivity] = useState('')
    const [dateTime, setDateTime] = useState(new Date());

    let davidRoss = ["Volleyball - Hall C/D"];
    let jubileeCampus = ["Volleyball - Hall 1"];
    let dropdownActivies = null;
    let activityOptions = null;

    let activityDate = '';
    let activityTime = '';
    let encryptedPassword = '';

    if (sportCentre == "David Ross"){
        dropdownActivies = davidRoss;
    } else if (sportCentre == "Jubilee Campus") {
        dropdownActivies = jubileeCampus;
    }

    if (dropdownActivies != null){
        activityOptions = dropdownActivies.map((activity) => <option value={activity}> {activity} </option>);
    }

    const monthsOfTheyear = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    function stringifyDateAndTime() {
        let month = monthsOfTheyear[dateTime.getMonth()];

        activityDate = `${dateTime.getDate()} ${month} ${dateTime.getFullYear()}`;
        activityTime = `${dateTime.getHours()}:00`;
    }

    function encryptPassword(e) {
        e.preventDefault();

        var ciphertext = CryptoJs.AES.encrypt(password, process.env.REACT_APP_ENCRYPTION_SECRET);
    
        encryptedPassword = ciphertext.toString();
    }

  return (
    <form onSubmit={(e) => {encryptPassword(e)}}>
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
            value={sportCentre}
            onChange={(e) => {setSportCentre(e.target.value)}}
        >
            <option>Choose...</option>
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

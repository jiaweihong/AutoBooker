import React, { useState, useEffect} from 'react'

const BookingTable = () => {
    const [bookings, setBookings] = useState([]);

    const getBookings = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/bookings");
    
            console.log(await res.json());
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getBookings()
    }, []);
    

    return (
        <div>
            Booking
        </div>
    )
}

export default BookingTable;
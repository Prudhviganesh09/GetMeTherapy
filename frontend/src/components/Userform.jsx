import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { backend_server } from '../constants';

function Userform() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { usermail } = useParams();
  const navigate = useNavigate(); // Use useNavigate for redirecting

  // Fetch data from API
  useEffect(() => {
    console.log('Fetching user data...');
    axios.get(`${backend_server}/user`)
      .then(response => {
        console.log('Data fetched:', response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); // Ensure loading is set to false on error
      });
  }, []);

  // Check authentication status
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('jwtoken') !== null;
    if (!isAuthenticated) {
      console.log('User not authenticated. Redirecting...');
      navigate("/"); // Redirect using navigate
    }
  }, [navigate]);

  // Handle booking
  const Handlebooking = (time, dremail, date) => {
    const [starttime, endtime] = time.split("-");
    console.log('Booking details:', { starttime, endtime, date, usermail, dremail });

    axios.post(`${backend_server}/book`, {
      starttime,
      endtime,
      date,
      usermail,
      dremail,
    })
    .then(response => {
      console.log('Booking response:', response.data);
      if (response.data === "booked") {
        alert("Booking confirmed");
        // Update the UI instead of reloading
        setData(data.filter(item => item.email !== dremail)); // Example of updating state
      }
    })
    .catch(err => {
      console.error('Error during booking:', err);
      alert("Booking failed, please try again.");
    });
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
          <thead className='th'>
            <tr>
              <th className='td'>Name</th>
              <th className='td'>Available Time</th>
            </tr>
          </thead>

          <tbody style={{ color: 'yellow' }}>
            {data.map((item, index) => (
              <tr key={index} style={{ color: 'yellow' }}>
                <td>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</td>
                <td>
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {item.time_range.split(',').map((timeRange, index1) => (
                      <li key={index1}>
                        {timeRange} on {item.availabledate}
                        <button
                          className='btn'
                          onClick={() => Handlebooking(timeRange, item.email, item.availabledate)}
                        >
                          Book
                        </button>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Userform;

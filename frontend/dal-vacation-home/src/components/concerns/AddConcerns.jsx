import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Typography, MenuItem, CircularProgress,Box } from '@mui/material';
import axios from 'axios';
import { getBookingByUser } from '../../services/BookingApiService';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../util/user-authentication/AuthenticationUtil';

//Customers can add concerns through this page. Customers will only see their booking reference numbers listed and can raise a concern for that.
const AddConcerns = () => {
  const navigate = useNavigate();
  const [bookingRefNumbers, setBookingRefNumbers] = useState([]);
  const [selectedRefNumber, setSelectedRefNumber] = useState('');
  const [concern, setConcern] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [filteredConcerns, setFilteredConcerns] = useState([]);



  useEffect(() => {
    const data = getUser();
    setUserData(data);
  }, []);

  useEffect(() => {
    if(userData){
    const fetchBookingRefNumbers = async () => {
      try {
        console.log("user data:",userData);
        const response = await getBookingByUser(userData); 
        console.log("All Booking data:",response)

        setBookingRefNumbers(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingRefNumbers();
  }
  }, [userData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      console.log({
        "booking_reference": selectedRefNumber,
        "customer_name": userData.firstname + " " + userData.lastname,
        "customer_email": userData.email,
        "concern": concern
    });
      const response = await axios.post('https://us-central1-csci-5408-data-management.cloudfunctions.net/publishConcern', {
        "booking_reference": selectedRefNumber,
        "customer_name": userData.firstname + " " + userData.lastname,
        "customer_email": userData.email,
        "concern": concern
    });
      console.log("Concern published successfully");
      if(response.status === 200){
        navigate('/subscribedconcerns');
      }      
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <>
    <Header user={userData}/>
    <Box mt={3}>
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            select
            label="Select Booking Reference Number"
            value={selectedRefNumber}
            onChange={(e) => setSelectedRefNumber(e.target.value)}
            fullWidth
            required
          >
            {bookingRefNumbers.map((ref) => (
              <MenuItem key={ref.bookingReferenceNumber} value={ref.bookingReferenceNumber}>
                {ref.bookingReferenceNumber}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Concern"
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Add Concern
          </Button>
        </Grid>
        {successMessage && (
          <Grid item xs={12}>
            <Typography color="primary">{successMessage}</Typography>
          </Grid>
        )}
      </Grid>
    </form>
    </Box>
    </>
  );
};

export default AddConcerns;

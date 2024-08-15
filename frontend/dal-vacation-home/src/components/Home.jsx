// pages/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import Header from '../components/Header'; 

const Home = () => {
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertyResponse = await axios.get('https://vrnylsjiye.execute-api.us-east-1.amazonaws.com/prod/property');
        console.log("Property details:", propertyResponse);
        const propertiesData = propertyResponse.data.Items.map(property => ({
          agentPool: property.agentPool?.S || '',
          propertyId: property.propertyId?.S || '',
          roomType: property.roomType?.S || '',
          roomNumber: property.roomNumber?.N || -1,
          occupancy: property.occupancy?.N || -1,
          ownerId: property.ownerId?.S || '',
          features: property.features?.S || '',
        }));
        setProperties(propertiesData);
      } catch (err) {
        setError(err);
      }
    };

    const fetchBookings = async () => {
      try {
        const bookingResponse = await axios.get('https://vrnylsjiye.execute-api.us-east-1.amazonaws.com/prod/booking');
        console.log("Booking details:", bookingResponse);
        const bookingData = bookingResponse.data.Items.map(booking => ({
          propertyId: booking.propertyId?.S || '',
          fromDate: booking.fromDate?.S || '',
          toDate: booking.toDate?.S || '',
        }));
        setBookings(bookingData);
      } catch (err) {
        setError(err);
      }
    };

    const fetchData = async () => {
      try {
        await fetchProperties();
        await fetchBookings();
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUnavailableDates = (propertyId) => {
    console.log(bookings.fromDate,bookings.toDate)
    return bookings
      .filter(booking => booking.propertyId === propertyId)
      .map(booking => ({
        fromDate: booking.fromDate,
        toDate: booking.toDate
      }));
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <>
      <Header user={null} />
      <Box mt={3}>
        <Typography variant="h4" gutterBottom>Room Bookings</Typography>
        <Grid container spacing={3}>
          {properties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.propertyId}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Room Number: {property.roomNumber}</Typography>
                  <Typography>Room Type: {property.roomType}</Typography>
                  <Typography>Occupancy: {property.occupancy}</Typography>
                  <Typography>Features: {property.features}</Typography>
                  <Typography variant="h6">Unavailable Dates:</Typography>
                  {getUnavailableDates(property.propertyId).length > 0 ? (
                    getUnavailableDates(property.propertyId).map((date, index) => (
                      <Typography key={index}>From: {date.fromDate} To: {date.toDate}</Typography>
                    ))
                  ) : (
                    <Typography>All bookings available</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Home;

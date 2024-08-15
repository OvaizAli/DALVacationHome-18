import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, TextField, Box } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const PropertyCard = ({ user, property, onApprove, onBook, handleDecline }) => {
  const [fromDate, setFromDate] = useState(dayjs().hour(9).minute(0));
  const [toDate, setToDate] = useState(dayjs().hour(9).minute(0));

  const handleFromDateChange = (newValue) => {
    setFromDate(newValue.hour(9).minute(0));
    if (newValue.isAfter(toDate)) {
      setToDate(newValue.hour(9).minute(0));
    }
  };

  const handleToDateChange = (newValue) => {
    if (newValue.isAfter(fromDate)) {
      setToDate(newValue.hour(9).minute(0));
    }
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Room Number: {property.roomNumber}
        </Typography>
        {user.role === 'guest' ? (
          <>
            <Typography variant="body2" color="text.secondary">
              {property.roomType} - Occupancy: {property.occupancy}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Features: {property.features}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={handleFromDateChange}
                renderInput={(props) => <TextField {...props} />}
              />
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={handleToDateChange}
                renderInput={(props) => <TextField {...props} />}
              />
            </LocalizationProvider>
            <Button variant="contained" color="primary" onClick={() => onBook(property, user.email, fromDate, toDate)}>
              Book
            </Button>
          </>
        ) : user.role === 'agent' ? (
          <>
            <Typography variant="body2" color="text.secondary">
              Booking Reference No: {property.bookingReferenceNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              User Email: {property.userId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              From Date: {property.fromDate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              To Date: {property.toDate}
            </Typography>
            <Button variant="contained" color="primary" onClick={() => onApprove(property.bookingReferenceNumber, property.userId)}>
              Approve
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleDecline(property.bookingReferenceNumber, property.userId)}>
              Decline
            </Button>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default PropertyCard;

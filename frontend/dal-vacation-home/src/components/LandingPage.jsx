import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUser } from '../util/user-authentication/AuthenticationUtil';
import { Grid, Card, CardContent, Typography, CircularProgress, TextField, Button,Box } from '@mui/material';
import {getPropertiesByRole} from '../services/PropertyApiService';
import PropertyCard from './PropertyCard';
import Header from './Header';
import {publishMessage} from '../services/NotificationApiService';

const LandingPage = () => {

    const [userData, setUserData] = useState(null);
    const [data,setData] = useState([]);
    const [error,setError] = useState("");
    const [loading,setLoading] = useState();
    const [role,setRole] = useState("");
    const [bookingRefNumber, setBookingRefNumber] = useState('');
    const [bookingApproved,setBookingApproved] = useState(false);
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            let response;
            console.log("Started fetchData in Landing page jsx...")
            const data = getUser();
            setUserData(data);
            console.log("Landing Page user data:",data)
            // const data = {"email": "abcd@example.com",
            //   "firstname": "ABCD",
            //   "lastname": "EFGH",
            //   "role": "student"} ;
            // setUserData(data);
            console.log("Role:",data.role)
            let role = data.role;
            setRole(role)
            response = await getPropertiesByRole(role);
            console.log("Response:::",response);
            setData(response);
          
          } catch (err) {
            setError(err);
            throw err;
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);
      if (loading) {
        return <CircularProgress />;
      }
    
      if (error) {
        return <Typography color="error">Error: {error.message}</Typography>;
      }

      const handleApprove = async (BookingReferenceNo, userId) => {
        try {
          console.log("Handle Approve called...",BookingReferenceNo);
          const response = await axios.post('https://pf8bgxkwz5.execute-api.us-east-1.amazonaws.com/prod/approveBooking', {"booking_reference":BookingReferenceNo });
          // const response = await axios.post('https://example.com/approve', { id });
          if (response.status === 200) {
            // setMessage('Booking approved for Booking Reference No:'+ BookingReferenceNo);
            console.log(response);
            setBookingRefNumber(BookingReferenceNo)
            setBookingApproved(true)
            let msg = "Your booking is approved for booking reference no " + BookingReferenceNo;
            publishMessage(userId, msg)
            setData((prevData) => prevData.filter(item => item.BookingReferenceNo !== BookingReferenceNo));
            // setData((prevData) => prevData.filter(item => item.id !== id));
          }
        } catch (error) {
          console.error('Error approving booking:', error);
        }
        window.location.reload();
      };

      const handleDecline = async (BookingReferenceNo, userId) => {
        try {
          console.log("Handle decline called...",BookingReferenceNo);
          const response = await axios.delete('https://vrnylsjiye.execute-api.us-east-1.amazonaws.com/prod/booking/' + BookingReferenceNo);
          console.log(response)
          if (response.status === 200) {
            // setMessage('Booking approved for Booking Reference No:'+ BookingReferenceNo);
            let msg = "Your booking is declined for booking reference no " + BookingReferenceNo;
            publishMessage(userId, msg)
            setData((prevData) => prevData.filter(item => item.BookingReferenceNo !== BookingReferenceNo));
            // setData((prevData) => prevData.filter(item => item.id !== id));
          }
        } catch (error) {
          console.error('Error approving booking:', error);
        }
        window.location.reload();
      };

      const generateRefCode = async(roomDetails,userName,fromDate,toDate) => {
        try{
          console.log("Generating reference code called",roomDetails,userName,fromDate.toISOString(),toDate.toISOString());
          // const { fromDate, toDate } = dates[roomDetails.id] || {};
          // console.log(roomDetails.roomNumber,roomDetails.propertyId,fromDate,toDate);
          const payload = { booking_request: {
            userId: userName,
            roomNumber: parseInt(roomDetails.roomNumber),
            propertyId: roomDetails.propertyId,
            isApproved: false,
            fromDate: fromDate.toISOString(),
            toDate: toDate.toISOString()
          }};
          const response = await axios.post('https://pf8bgxkwz5.execute-api.us-east-1.amazonaws.com/prod/bookingRoom',
           payload, {headers:{'Content-Type':'application/json'},}
          );
          console.log("Response:",response.data,typeof(response.data));
          const responseBody = JSON.parse(response.data.body);
          if (responseBody.bookingReferenceId) {
            setBookingRefNumber(responseBody.bookingReferenceId);
            publishMessage(userData.email,"Thank you for booking the room. You will get an booking approval message once the booking is approved by an agent. This is the booking reference number:" + responseBody.bookingReferenceId + ". If you have any concerns then you can use the concern form and agent will help you solve the query.")
          } else {
            setBookingRefNumber(''); 
          }
        }
        catch(error){
          console.error("Error while booking room:",error)
        }
      }

      const handleEdit = async (propertyId, updatedProperty) => {
        try {
          console.log("Handle Edit called...", propertyId, updatedProperty);
          // const response = await axios.put(`https://api.example.com/properties/${propertyId}`, updatedProperty, { headers: { 'Content-Type': 'application/json' } });
          if (response.status === 200) {
            console.log(response);
            setData((prevData) => prevData.map(property => property.propertyId === propertyId ? updatedProperty : property));
          }
        } catch (error) {
          console.error('Error updating property:', error);
        }
      };
    

    return (
        <>
        <Header user={userData}/>
        {bookingRefNumber && userData.role==='guest' && (
        <Typography variant="h6" gutterBottom style={{ marginTop: '20px', marginLeft: '30px' }}>
          We have received your Booking request. You will get an email once your booking is approved by an agent.
          Booking Reference Number: {bookingRefNumber}. Please keep this booking reference number with you and you can
          ask any concerns about using this booking reference number.
        </Typography>
      )}
        {bookingApproved && userData.role==='agent' && (
        <Typography variant="h6" gutterBottom style={{ marginTop: '20px', marginLeft: '30px' }}>
          Booking confirmed with Booking Reference Number: {bookingRefNumber}.
        </Typography>
      )}
      <Box mt={3}>
         <Grid container spacing={3}>
      {data.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.propertyId || item.BookingReferenceNo}>
          <PropertyCard user={userData} property={item} onBook={generateRefCode} onApprove={handleApprove} onEdit={handleEdit} handleDecline={handleDecline} />
        </Grid>
      ))}
    </Grid>
    </Box>  
        </>
    )
}

export default LandingPage;

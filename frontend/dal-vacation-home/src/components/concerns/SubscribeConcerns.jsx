import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Typography, Card, CardContent, Button } from '@mui/material';
import Header from '../Header';
import axios from 'axios';
import AddMessages from './AddMessages';
import { getUser } from '../../util/user-authentication/AuthenticationUtil';
// This page is for subscribe concerns. After user has raised concern, they are given an option for a live chat.
const SubscribeConcerns = () => {
    const [concern, setConcern] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chatInitialized, setChatInitialized] = useState(false);
    const [user, setUser] = useState(() => getUser())

    // Fetching raised concern by the user.
    useEffect(() => {
        const fetchConcerns = async () => {
            try {
                const response = await axios.get('https://us-central1-csci-5408-data-management.cloudfunctions.net/subscribeConcern');
                setConcern(response.data);
                console.log(response);
            } catch (error) {
                console.error("Error while getting the concern:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchConcerns();
    }, []);
    // Initializing live chat if user requests it.
    const handleLiveChat = async (concern) => {
        try{
        console.log('Initiating live chat for concern:', concern);
        const initializeChatResponse = await axios.post('https://us-central1-csci-5408-data-management.cloudfunctions.net/initializeChat', {
          "booking_reference": concern.booking_reference,
          "customer_name": concern.customer_name,
          "customer_email": concern.customer_email,
          "concern": concern.concern,
          "assigned_agent" : concern.assigned_agent
      });
      console.log("Initialize Chat response:",initializeChatResponse)
      if(initializeChatResponse.message == "No messages available"){
        setError("No messages available");
      }
      else{
        setError("")
        setChatInitialized(true);
      }
      
    }
    catch(error){
      console.log("Error while initializing the chat:",error);
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
        <Header user={user} />
            {!chatInitialized ? ( 
            <Grid container spacing={3} style={{ marginTop: '20px' }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Agent: {concern.assigned_agent}</Typography>
                            <Typography variant="h6">Booking Reference: {concern.booking_reference}</Typography>
                            <Typography variant="body1">Customer Name: {concern.customer_name}</Typography>
                            <Typography variant="body1">Customer Email: {concern.customer_email}</Typography>
                            <Typography variant="body1">Concern: {concern.concern}</Typography>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => handleLiveChat(concern)} 
                                style={{ marginTop: '10px' }}
                            >Live Chat
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid> ) :  (
                    <AddMessages concern={concern} />
                )}
    </>    
    );
};

export default SubscribeConcerns;

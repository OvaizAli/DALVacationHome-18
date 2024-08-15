import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { getUser} from '../../util/user-authentication/AuthenticationUtil';
import Header from '../Header';
// This page is for showing all messages of all concerns raised by customer as well as agent can see all the messages replied for all the concerns assigned to them.
const ShowMessages = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [chats, setChats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reply, setReply] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = getUser();
                setUser(user);
                console.log("Current user:",user)
                console.log({ email: user?.email, userType: user?.role.charAt(0).toUpperCase() + user?.role.slice(1) })
                let bookingsResponse = undefined;
                axios.post('https://us-central1-csci-5408-data-management.cloudfunctions.net/myChats', 
                    { email: user?.email, userType: user?.role.charAt(0).toUpperCase() + user?.role.slice(1) },
                ).then((res) => {
                    bookingsResponse = res
                    console.log("bookingsResponse",bookingsResponse)
                    const bookingIds = bookingsResponse.data.chat_id;
                console.log("BookingIds:",bookingIds);
                setBookings(bookingIds);
                }).catch((error) => {
                    setError("No booking reference found...")
                })
        }
        catch (err) {
            console.log(err.message);
          } finally {
            setLoading(false);
          } };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchChats = async () => {
          try {
            if (bookings.length > 0) {
              const chatsData = {};
              for (const ref of bookings) {
                const response = await axios.post('https://us-central1-csci-5408-data-management.cloudfunctions.net/getConversation', { chat_id: ref });
                console.log("Response",response);
                if (response.status === 200) {
                  chatsData[ref] = Array.isArray(response.data.messages) ? response.data.messages : [];
                }
                if(response.status === 404){
                    setError("No messages found...")
                }
              }
              setChats(chatsData);
            }
          } catch (err) {
            console.log(err.message);
          }
        };
    
        fetchChats();
      }, [bookings]);


    const handleReplyChange = (bookingId, value) => {
        setReply((prev) => ({ ...prev, [bookingId]: value }));
    };

    const handleReplySubmit = async (bookingId) => {
        try {
            const replyMessage = reply[bookingId];
            const replyMessageRequest = {
                chat_id: bookingId,
                message: replyMessage,
                sender: user?.email,
            };
            console.log(replyMessageRequest)
            await axios.post('https://us-central1-csci-5408-data-management.cloudfunctions.net/addMessageToChats', replyMessageRequest );
            setReply((prev) => ({ ...prev, [bookingId]: '' }));
            console.log(bookingId)
            // Fetching chats again to display the new message
            const chatResponse = await axios.post('https://us-central1-csci-5408-data-management.cloudfunctions.net/getConversation', { chat_id: bookingId });
            if (chatResponse.status === 200) {
                setChats((prev) => ({
                    ...prev,
                    [bookingId]: Array.isArray(chatResponse.data.messages) ? chatResponse.data.messages : [],
                }));
            }
            
        } catch (err) {
            console.error('Error sending reply:', err);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

    return (
        <>
            <Header user={user} />
            <Box sx={{ padding: 3 }}>
                {bookings ? bookings.map((bookingId) => (
                    <Card key={bookingId} sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="h6">Booking Reference: {bookingId}</Typography>
                            {Array.isArray(chats[bookingId]) ? chats[bookingId].map((chat, index) => (
                                <Box key={index} sx={{ marginBottom: 1 }}>
                                    <Typography variant="body1"><strong>{chat.sender}:</strong> {chat.message}</Typography>
                                </Box>
                            )) : <Typography>No messages available</Typography>}
                            <TextField
                                fullWidth
                                label="Your Reply"
                                variant="outlined"
                                value={reply[bookingId] || ''}
                                onChange={(e) => handleReplyChange(bookingId, e.target.value)}
                                sx={{ marginBottom: 1 }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleReplySubmit(bookingId)}
                            >
                                Send Reply
                            </Button>
                        </CardContent>
                    </Card>
                )) : <Typography>No messages available</Typography>}
            </Box>
        </>
    );
};

export default ShowMessages;

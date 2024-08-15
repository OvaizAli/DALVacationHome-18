import React, { useState } from 'react'
import { saveFeedback } from '../services/PropertyApiService';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { DEFAULT_FEEDBACK } from '../util/Constants';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { getUser } from '../util/user-authentication/AuthenticationUtil';

function FeedbackForm() {
  const [feedback, setFeedback] = useState(DEFAULT_FEEDBACK)
  let navigate = useNavigate();
  const user = getUser();
  const isValidData = () => {
    if (feedback.roomNumber === "" || feedback.roomNumber < 0 || feedback.roomNumber > 5000 || feedback.message === "" 
      || feedback.rating < 0 || feedback.rating > 5 || feedback.userId === "" || feedback.rating === "") {
      return false;
    } else {
      return true;
    }
  }

  return (

    <>
    <Header user={user}/>
    <Container maxWidth="xs">
      <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '5vh', fontWeight: 'bold' }}>Feedback</Typography>
      <Grid container rowGap={3} columnSpacing={2}>
        <Grid item md={12}>
          <TextField
            fullWidth
            required
            id="email"
            label="Email"
            variant="outlined"
            onChange={(event) => setFeedback(prev => ({ ...prev, userId: event.target.value }))} />
        </Grid>
        <Grid item md={12}>
          <TextField
            fullWidth
            required
            type="number"
            id="roomNumber"
            label="Room Number"
            variant="outlined"
            onChange={(event) => setFeedback(prev => ({ ...prev, roomNumber: event.target.value }))} />
        </Grid>
        <Grid item md={12}>
          <TextField
            fullWidth
            required
            InputProps={{ inputProps: { min: 0 } }}
            type="number"
            id="rating"
            label="Rating (1-5)"
            variant="outlined"
            onChange={(event) => setFeedback(prev => ({ ...prev, rating: event.target.value }))} />
        </Grid>
        <Grid item md={12}>
          <TextField
            fullWidth
            required
            id="message"
            label="Message"
            variant="outlined"
            onChange={(event) => setFeedback(prev => ({ ...prev, message: event.target.value }))} />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button disabled={!isValidData()} type="submit" variant="contained" onClick={() => saveFeedback(feedback, navigate)}>Submit</Button>
        </Grid>
      </Grid>
    </Container>
    </>
  )
}

export default FeedbackForm

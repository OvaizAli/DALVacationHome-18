import React, { useState } from 'react'
import { Alert, Button, Container, Grid, TextField, Typography } from '@mui/material';

export default function ConfirmRegistration({ setAuthStep, cognitoUser }) {
  const [confirmationCode, setConfirmationCode] = useState();
  const [showAlert, setShowAlert] = useState(false)

  const handleSubmit = () => {
    cognitoUser.confirmRegistration(confirmationCode, true, (error, data) => {
      if (error) {
        setShowAlert(true)
      } else {
        setShowAlert(false)
        setAuthStep(prev => prev + 1)
      }
    })
  }

  return (
    <Container maxWidth="xs">
      <Grid container rowGap={3} columnSpacing={2}>
        <Grid item md={12}>
          <Typography>Enter the confirmation code sent to your email.</Typography>
        </Grid>
        {showAlert &&
          <Grid item md={12}>
            <Alert severity="error">Confirmation code is invalid. Try Again!</Alert>
          </Grid>
        }
        <Grid item md={12}>
          <TextField
            fullWidth
            id="Enter Confirmation Code"
            label="confirmationCode"
            variant="outlined"
            onChange={(event) => setConfirmationCode(event.target.value)} />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="submit" variant="contained" onClick={handleSubmit}>Next</Button>
        </Grid>
      </Grid>
    </Container>
  )
}

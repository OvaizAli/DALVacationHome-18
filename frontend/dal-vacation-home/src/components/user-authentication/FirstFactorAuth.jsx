import { Button, Container, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material'
import React from 'react'

function FirstFactorAuth({ setAuthStep, data, setData, isRegister }) {

  const isValidData = () => {
    if (isRegister && (data.firstname === "" || data.lastname === ""
      || data.email === "" || data.password === "" || data.role === "")) {
      return false
    } else if (!isRegister && (data.email === "" || data.password === "")) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <Container maxWidth="xs">
      <Grid container rowGap={3} columnSpacing={2}>
        {
          isRegister &&
          <Grid item container md={12} rowGap={3} columnSpacing={2}>
            <Grid item md={12}>
              <RadioGroup sx={{ display: 'flex', justifyContent: 'center' }} row name="role"
                onChange={(event) => setData(prev => ({ ...prev, role: event.target.value }))}>
                <FormControlLabel value="guest" control={<Radio />} label="Guest" />
                <FormControlLabel value="agent" control={<Radio />} label="Property Agent" />
              </RadioGroup>
            </Grid>
            <Grid item md={6}>
              <TextField
                fullWidth
                required
                id="firstname"
                label="Firstname"
                variant="outlined"
                onChange={(event) => setData(prev => ({ ...prev, firstname: event.target.value }))} />
            </Grid>
            <Grid item md={6}>
              <TextField
                fullWidth
                required
                id="lastname"
                label="Lastname"
                variant="outlined"
                onChange={(event) => setData(prev => ({ ...prev, lastname: event.target.value }))} />
            </Grid>
          </Grid>
        }
        <Grid item md={12}>
          <TextField
            fullWidth
            required
            id="email"
            label="Email"
            variant="outlined"
            onChange={(event) => setData(prev => ({ ...prev, email: event.target.value }))} />
        </Grid>
        <Grid item md={12}>
          <TextField
            fullWidth
            required
            type="password"
            id="password"
            label="Password"
            variant="outlined"
            onChange={(event) => setData(prev => ({ ...prev, password: event.target.value }))} />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button disabled={!isValidData()} type="submit" variant="contained" onClick={() => setAuthStep(prev => prev + 1)}>Next</Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default FirstFactorAuth

import { Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React from 'react'
import { SECURITY_QUESTIONS } from '../../util/Constants'

function SecondFactorAuth({ setAuthStep, data, setData }) {

  const isValidData = () => {
    if (data.q1 === "" || data.a1 === "" || data.q2 === "" || data.a2 === "" || data.q3 === ""
      || data.a3 === "" || data.q1 === data.q2 || data.q1 === data.q3 || data.q2 === data.q3) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <Container maxWidth="xs">
      <Grid container rowGap={3} columnSpacing={2}>
        <Grid item md={12}>
          <FormControl fullWidth>
            <InputLabel id="securityQuestion1Label">Security Question 1</InputLabel>
            <Select
              labelId="securityQuestion1Label"
              required
              id="securityQuestion1"
              label="Security Question 1"
              onChange={(event) => setData(prev => ({ ...prev, q1: event.target.value }))}
            >
              {
                SECURITY_QUESTIONS.map(data => (
                  <MenuItem value={data}>{data}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={12}>
          <TextField
            fullWidth
            required
            id="securityAnswer1"
            label="Security Answer 1"
            variant="outlined"
            onChange={(event) => setData(prev => ({ ...prev, a1: event.target.value }))} />
        </Grid>

        <Grid item md={12}>
          <FormControl fullWidth>
            <InputLabel id="securityQuestion2Label">Security Question 2</InputLabel>
            <Select
              labelId="securityQuestion2Label"
              required
              id="securityQuestion2"
              label="Security Question 2"
              onChange={(event) => setData(prev => ({ ...prev, q2: event.target.value }))}
            >
              {
                SECURITY_QUESTIONS.map(data => (
                  <MenuItem value={data}>{data}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={12}>
          <TextField
            fullWidth
            required
            id="securityAnswer2"
            label="Security Answer 2"
            variant="outlined"
            onChange={(event) => setData(prev => ({ ...prev, a2: event.target.value }))} />
        </Grid>

        <Grid item md={12}>
          <FormControl fullWidth>
            <InputLabel id="securityQuestion3Label">Security Question 3</InputLabel>
            <Select
              labelId="securityQuestion3Label"
              required
              id="securityQuestion3"
              label="Security Question 3"
              onChange={(event) => setData(prev => ({ ...prev, q3: event.target.value }))}
            >
              {
                SECURITY_QUESTIONS.map(data => (
                  <MenuItem value={data}>{data}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={12}>
          <TextField
            fullWidth
            required
            id="securityAnswer3"
            label="Security Answer 3"
            variant="outlined"
            onChange={(event) => setData(prev => ({ ...prev, a3: event.target.value }))} />
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button disabled={!isValidData()} type="submit" variant="contained" onClick={() => setAuthStep(prev => prev + 1)}>Next</Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default SecondFactorAuth

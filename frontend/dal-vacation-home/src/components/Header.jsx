import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../util/user-authentication/AuthenticationUtil';
import {AgentDashboard} from '../components/dashboard/AgentDashboard';
import {UserDashboard} from '../components/dashboard/UserDashboard';
import { UserContextProvider } from '../App';
import axios from 'axios';
import { setIsUserLoggedIn } from '../services/AuthenticationApiService';

const Header = ({user}) => {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContextProvider);
  const navigate = useNavigate();
  console.log("Header user data:",user);
  
  const handleLogout = () => {
    let userLoggedInData = {
      "email": user.email,
      "isLoggedIn": false
    }
    setIsUserLoggedIn(userLoggedInData)
    const response = axios.get('https://us-central1-csci-5408-data-management.cloudfunctions.net/loadBigQuery');
      console.log("Big Query data updated API Response:",response);
      if(response.status === 200){
        console.log("Data updated to BigQuery successfully.")
      }
    sessionStorage.removeItem("user");
    setIsLoggedIn(false)
    navigate('/login');
    window.location.reload();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
        {!isLoggedIn && (
            <>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/userdashboard">View Room Feedback and Polarity</Button>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}

          {isLoggedIn && user?.role === 'agent' && (
            <>
              <Button color="inherit" component={Link} to="/landing">Home</Button>
              <Button color="inherit" component={Link} to="/agentdashboard">Agent Dashboard</Button>
              <Button color="inherit" component={Link} to="/addproperty">Add Property</Button>
              <Button color="inherit" component={Link} to="/editproperty">Edit Property</Button>
              <Button color="inherit" component={Link} to="/mychats">My Chats</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          )}

          {isLoggedIn && user?.role === 'guest' && (
            <>
              <Button color="inherit" component={Link} to="/landing">Home</Button>
              <Button color="inherit" component={Link} to="/userdashboard">User Dashboard</Button>
              <Button color="inherit" component={Link} to="/addconcerns">Concerns</Button>
              <Button color="inherit" component={Link} to="/feedback">Feedback</Button>
              <Button color="inherit" component={Link} to="/mychats">My Chats</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          )}
          
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

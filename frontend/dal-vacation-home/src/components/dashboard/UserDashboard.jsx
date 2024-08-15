import React from 'react';
import { Box, Typography } from '@mui/material';
import Header from '../Header';
import { getUser } from '../../util/user-authentication/AuthenticationUtil';
// User dashboard embedded in this page.
const UserDashboard = () => {
    const embedUrl = "https://lookerstudio.google.com/embed/u/0/reporting/d35be7a0-287c-4bb8-afd1-1c48e86fa283/page/lkM4D";
    const user = getUser();
  return (
    <>
    <Header user={user}/>
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ flex: 1}}>
      <iframe
        src={embedUrl}
        style={{ border: 0, width: '100%', height: '100%' }}
        allowFullScreen
        title="Dal Vacation - Home Dashboard"
      ></iframe>
    </Box>
  </Box>
  </>
  );
};

export default UserDashboard;

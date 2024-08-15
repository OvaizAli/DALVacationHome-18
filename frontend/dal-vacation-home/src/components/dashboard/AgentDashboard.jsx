import React from 'react';
import { Box, Typography } from '@mui/material';
import Header from '../Header';
import { getUser } from '../../util/user-authentication/AuthenticationUtil';
// Agent dashboard embedded in these page.
const AgentDashboard = () => {
    const embedUrl = "https://lookerstudio.google.com/embed/u/0/reporting/4939d1fa-0ba3-4d2f-835d-6741275d7d66/page/lkM4D";
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

export default AgentDashboard;

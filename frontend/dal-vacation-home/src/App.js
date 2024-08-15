import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/user-authentication/Login';
import Register from './components/user-authentication/Register';
import AddProperty from './components/AddProperty';
import AgentDashboard from './components/dashboard/AgentDashboard';
import UserDashboard from './components/dashboard/UserDashboard'
import LandingPage from './components/LandingPage';
import AddConcerns from './components/concerns/AddConcerns';
import SubscribeConcerns from './components/concerns/SubscribeConcerns';
import Chatbot from './components/Chatbot';
import { createContext, useState } from 'react';
import { getUser, isUserLoggedIn } from './util/user-authentication/AuthenticationUtil';
import FeedbackForm from './components/FeedbackForm';
import EditProperty from './components/EditProperty';
import ShowMessages from './components/concerns/ShowMessages';
import Home from './components/Home';

export const UserContextProvider = createContext();

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem("user") ? true : false)

  return (
    <UserContextProvider.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agentdashboard" element={isLoggedIn ? <AgentDashboard /> : <Login/>} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/addproperty" element={isLoggedIn ? <AddProperty /> : <Login/>} />
          <Route path="/editproperty" element={isLoggedIn ? <EditProperty /> : <Login/>} />
          <Route path="/landing" element={isLoggedIn ? <LandingPage /> : <Login/>} />
          <Route path="/addconcerns" element={isLoggedIn ? <AddConcerns /> : <Login/>} />
          <Route path="/feedback" element={isLoggedIn ? <FeedbackForm /> : <Login/>} />
          <Route path="/subscribedconcerns" element={isLoggedIn ? <SubscribeConcerns /> : <Login/>} />
          <Route path="/mychats" element={isLoggedIn ? <ShowMessages /> : <Login/>} />
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </UserContextProvider.Provider>
  );
}

export default App;

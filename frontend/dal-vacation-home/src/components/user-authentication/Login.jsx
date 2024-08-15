import { Alert, Container, Typography } from '@mui/material'
import React, { useState, useEffect, useContext } from 'react'
import UserPool from '../../util/user-authentication/UserPool';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import FirstFactorAuth from './FirstFactorAuth';
import SecondFactorAuth from './SecondFactorAuth';
import ThirdFactorAuth from './ThirdFactorAuth';
import { setIsUserLoggedIn, verifyCipherText, verifySecurityQuestions } from '../../services/AuthenticationApiService';
import { encryptCipherText, formatSecurityQA, setUser } from '../../util/user-authentication/AuthenticationUtil';
import { DEFAULT_FIRST_FACTOR_AUTH, DEFAULT_SECOND_FACTOR_AUTH, DEFAULT_THIRD_FACTOR_AUTH } from '../../util/Constants';
import {useNavigate} from 'react-router-dom';
import { UserContextProvider } from '../../App';
import axios from 'axios';
import { publishMessage } from '../../services/NotificationApiService';
import Header from '../Header';

function Login() {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContextProvider);
  const [authStep, setAuthStep] = useState(0);
  const [firstFactorAuthData, setFirstFactorAuthData] = useState(DEFAULT_FIRST_FACTOR_AUTH)
  const [secondFactorAuthData, setSecondFactorAuthData] = useState(DEFAULT_SECOND_FACTOR_AUTH)
  const [thirdFactorAuthData, setThirdFactorAuthData] = useState(DEFAULT_THIRD_FACTOR_AUTH)
  const [userData, setUserData] = useState()

  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState()
  const [verifiedSecondFactorAuth, setVerifiedSecondFactorAuth] = useState()
  const [verifiedThirdFactorAuth, setVerifiedThirdFactorAuth] = useState()
  const navigate = useNavigate();

  const authenticateUser = () => {
    const user = new CognitoUser({
      Username: firstFactorAuthData.email,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: firstFactorAuthData.email,
      Password: firstFactorAuthData.password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        setShowAlert(false)
        setAuthStep(2)
      },
      onFailure: (error) => {
        setAuthStep(0)
        setShowAlert(true)
        setAlertMessage(error.message)
      }
    })
  }

  useEffect(() => {
    if (verifiedSecondFactorAuth === "verified") {
      setShowAlert(false)
      setAuthStep(4)
    } else if (verifiedSecondFactorAuth === "unverified") {
      setAuthStep(2)
      setShowAlert(true)
      setAlertMessage("Incorrect security questions and answers.")
    }
  }, [verifiedSecondFactorAuth]);

  useEffect(() => {
    if (verifiedThirdFactorAuth === "verified") {
      setShowAlert(false)
      setAuthStep(0)
      let user = {
        "email": firstFactorAuthData.email,
        "firstname": userData.firstname,
        "lastname": userData.lastname,
        "role": userData.role
      }
      let userLoggedInData = {
        "email": firstFactorAuthData.email,
        "isLoggedIn": true
      }
      setIsUserLoggedIn(userLoggedInData)
      setUser(user)
      const response = axios.get('https://us-central1-csci-5408-data-management.cloudfunctions.net/loadBigQuery');
      console.log("Big Query data updated API Response:",response);
      if(response.status === 200){
        console.log("Data updated to BigQuery successfully.")
      }
      // alert("Successful login")
      setIsLoggedIn(true)
      console.log("Emailing successful login>>>>")
      publishMessage(firstFactorAuthData.email,"You have logged in successfully.")
      navigate('/landing')
      window.location.reload();
    } else if (verifiedThirdFactorAuth === "unverified") {
      setAuthStep(4)
      setShowAlert(true)
      setAlertMessage("Invalid cipher or shift number.")
    }
  }, [verifiedThirdFactorAuth]);

  const validateSecurityQuestions = () => {
    let data = {
      "data": formatSecurityQA(secondFactorAuthData),
      "email": firstFactorAuthData.email
    }
    verifySecurityQuestions(data, setVerifiedSecondFactorAuth);
  }

  const validateCipherText = () => {
    let data = {
      "data": encryptCipherText(thirdFactorAuthData.cipherText, thirdFactorAuthData.shiftNumber),
      "email": firstFactorAuthData.email
    }
    verifyCipherText(data, setVerifiedThirdFactorAuth, setUserData);
  }

  return (
    <>
      <Header user={null} />
      <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '5vh', fontWeight: 'bold' }}>Login</Typography>
      {showAlert &&
        <Container maxWidth="xs" sx={{ py: '3%' }}>
          <Alert severity="error">{alertMessage}</Alert>
        </Container>
      }
      {authStep === 0 && <FirstFactorAuth setAuthStep={setAuthStep} data={firstFactorAuthData} setData={setFirstFactorAuthData} isRegister={false} />}
      {authStep === 1 && authenticateUser()}

      {authStep === 2 && <SecondFactorAuth setAuthStep={setAuthStep} data={secondFactorAuthData} setData={setSecondFactorAuthData} />}
      {authStep === 3 && validateSecurityQuestions()}

      {authStep === 4 && <ThirdFactorAuth setAuthStep={setAuthStep} data={thirdFactorAuthData} setData={setThirdFactorAuthData} />}
      {authStep === 5 && validateCipherText()}
    </>
  )
}

export default Login

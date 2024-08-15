import React, { useState } from 'react';
import FirstFactorAuth from './FirstFactorAuth';
import SecondFactorAuth from './SecondFactorAuth';
import ThirdFactorAuth from './ThirdFactorAuth';
import { Alert, Container, Typography } from '@mui/material';
import ConfirmRegistration from './ConfirmRegistration';
import { AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import UserPool from '../../util/user-authentication/UserPool';
import { encryptCipherText, formatSecurityQA } from '../../util/user-authentication/AuthenticationUtil';
import { getUserData, saveUserRegistration } from '../../services/AuthenticationApiService';
import { DEFAULT_FIRST_FACTOR_AUTH, DEFAULT_SECOND_FACTOR_AUTH, DEFAULT_THIRD_FACTOR_AUTH } from '../../util/Constants';
import {useNavigate} from 'react-router-dom';
import Header from '../Header';
import { publishMessage, subscribeUser } from '../../services/NotificationApiService';
import axios from 'axios';

export default function Register() {
  const [authStep, setAuthStep] = useState(0);
  const [firstFactorAuthData, setFirstFactorAuthData] = useState(DEFAULT_FIRST_FACTOR_AUTH)
  const [secondFactorAuthData, setSecondFactorAuthData] = useState(DEFAULT_SECOND_FACTOR_AUTH)
  const [thirdFactorAuthData, setThirdFactorAuthData] = useState(DEFAULT_THIRD_FACTOR_AUTH)
  const [cognitoUser, setCognitoUser] = useState()

  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState()
  const navigate = useNavigate();

  const saveUserToCognito = () => {
    const attributeList = [];
    attributeList.push(
      new CognitoUserAttribute({
        Name: 'email',
        Value: firstFactorAuthData.email,
      })
    );
    UserPool.signUp(firstFactorAuthData.email, firstFactorAuthData.password, attributeList, null, (error, data) => {
      if (error) {
        setAuthStep(0)
        setShowAlert(true)
        setAlertMessage(error.message)
      } else {
        setShowAlert(false)
        setCognitoUser(data.user)
        setAuthStep(2)
      }
    })
  }

  const registerUser = () => {
    let userData = {
      "email": firstFactorAuthData.email,
      "firstname": firstFactorAuthData.firstname,
      "lastname": firstFactorAuthData.lastname,
      "role": firstFactorAuthData.role,
      "securityQuestions": formatSecurityQA(secondFactorAuthData),
      "cipherText": encryptCipherText(thirdFactorAuthData.cipherText, thirdFactorAuthData.shiftNumber),
      "isLoggedIn": false
    }
    const authDetails = new AuthenticationDetails({
      Username: firstFactorAuthData.email,
      Password: firstFactorAuthData.password,
    });
    if(saveUserRegistration(userData, cognitoUser, authDetails)) {
      const response = axios.get('https://us-central1-csci-5408-data-management.cloudfunctions.net/loadBigQuery');
      console.log("Big Query data updated API Response:",response);
      if(response.status === 200){
        console.log("Data updated to BigQuery successfully.")
      }
      subscribeUser(firstFactorAuthData.email)
      publishMessage(firstFactorAuthData.email,"You are successfully registered.")
      // alert("User registered")
      navigate('/login')
    } else {
      setShowAlert(true)
      setAlertMessage("Registration failed. Please try again!")
    }
  }

  return (
    <>
      <Header user={null} />
      <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '5vh', fontWeight: 'bold' }}>Register</Typography>
      {showAlert &&
        <Container maxWidth="xs" sx={{ py: '3%' }}>
          <Alert severity="error">{alertMessage}</Alert>
        </Container>
      }
      {authStep === 0 && <FirstFactorAuth setAuthStep={setAuthStep} data={firstFactorAuthData} setData={setFirstFactorAuthData} isRegister={true} />}
      {authStep === 1 && saveUserToCognito()}
      {authStep === 2 && <ConfirmRegistration setAuthStep={setAuthStep} cognitoUser={cognitoUser} />}

      {authStep === 3 && <SecondFactorAuth setAuthStep={setAuthStep} data={secondFactorAuthData} setData={setSecondFactorAuthData} />}
      {authStep === 4 && <ThirdFactorAuth setAuthStep={setAuthStep} data={thirdFactorAuthData} setData={setThirdFactorAuthData} />}
      {authStep === 5 && registerUser()}
    </>
  )
}
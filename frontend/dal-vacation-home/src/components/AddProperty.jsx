import { TextField, Typography,InputLabel,Select,MenuItem,Box,Button,OutlinedInput } from '@mui/material'
import React, { useEffect } from 'react'
import { useState } from 'react';
import { getUser } from '../util/user-authentication/AuthenticationUtil';
import Header from './Header';
import axios from 'axios';

const AddProperty = () => {

    const [data,setData] = useState({ownerId:'',features:'',occupancy:'',roomNumber:'',roomType:'',agentPool:[],price:0});
    const [user,setUser] = useState(null);
    const [message,setMessage] = useState('');
    const [agents,setAgents] = useState([]);
    const [selectedAgents, setSelectedAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const user = getUser();
          setUser(user)
          const response = await axios.get('https://vrnylsjiye.execute-api.us-east-1.amazonaws.com/prod/user', {
            headers: { 'Content-Type': 'application/json' }
          });
          console.log("Users data:",response)
          if (response.status === 200) {
            const data = response.data.Items;
            const agentValues = data
              .filter(user => user.role?.S === 'agent')
              .map(agent => agent.email.S);
              console.log("Agent Values:",agentValues)
              setAgents(agentValues);
          } else {
            setAgents([]);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, []);

    //const agentValues= ['tom.brown@example.com','john.doe@example.com','alan.brown@example.com','shaun.murphy@example.com'];
    useEffect(() => {
        const userData = getUser();
        setUser(userData)
    },[]);

    
    const handleChange = (event) => {
        const {name,value} = event.target;
        setData(prevData => ({
            ...prevData,
            [name]: name === 'price' ? Number(value) : value
        }));
    };

    const handleMultipleAgentChange = (event) => {
      const { target: { value } } = event;
      const selected = typeof value === 'string' ? value.split(',') : value;
      setSelectedAgents(selected);
      setData(prevData => ({
        ...prevData,
        agentPool: selected
      }));
      //   const {
    //     target: { value },
    //   } = event;
    //   setSelectedAgents(
    //     typeof value === 'string' ? value.split(',') : value,
    //   );
    //   setData(prevData => ({
    //     ...prevData,
    //     agentPool: typeof value === 'string' ? value.split(',') : value
    // }));
    };
  

    const addproperty = async () => {
        try{
        const ownerId = user?.email;
        console.log("Add Property data which is to be added:",data);
        const propertyData = {...data, ownerId:ownerId,propertyId:'P'+data.roomNumber,agentPool: data.agentPool.join(',')};
        console.log("Property data:",propertyData)
        const response = await fetch('https://vrnylsjiye.execute-api.us-east-1.amazonaws.com/prod/property',{method:'POST',headers:{'Content-Type':'application/json'},
            body:JSON.stringify(propertyData)});
        if(!response.ok){
            throw new Error('Failed to add a new Property!');
        }
        const result = await response.json();
        console.log("Adding property response:",result)
        setMessage('Property added successfully.')
        console.log(user);
        setData({ownerId:'',features:'',occupancy:'',roomNumber:'',roomType:'',agentPool:[],price:0});
        }
        catch(error){
          console.log('Error:',error)
          setMessage('Error while adding Property.')
        }
        
    }

  return (
    <>
    <Header user={user}/>
    {message && (
            <Typography variant="h6" color="success" style={{ marginBottom: '20px' }}>
              {message}
            </Typography>
          )}
    <Box sx={{width:'400px',margin: 'auto', marginTop:3 }}>
    <Typography variant='h5'>Add Property</Typography>
    <TextField label="Enter Features" fullWidth  margin="normal" name="features" value={data.features} onChange={handleChange}/>
    <TextField label="Enter Occupancy" fullWidth margin='normal' name="occupancy" value={data.occupancy} onChange={handleChange}/>
    <TextField label="Enter Room Number" fullWidth margin='normal' name="roomNumber" value={data.roomNumber} onChange={handleChange}/>
    <TextField label="Enter Price" fullWidth margin='normal' name="price" value={data.price} onChange={handleChange}/>
    <InputLabel id="select-room-type-label">Select Room Type</InputLabel>
    <Select
    id="select-room-type-dropdown"
    name="roomType"
    value={data.roomType}
    onChange={handleChange}
    label="Room Type"
    fullWidth
    >
    <MenuItem value={"1 Bedroom"}>1 Bedroom</MenuItem>
    <MenuItem value={"2 Bedroom"}>2 Bedroom</MenuItem>
    <MenuItem value={"3 Bedroom"}>3 Bedroom</MenuItem>
    <MenuItem value={"Recreation Room"}>Recreation Room</MenuItem>
    </Select>
    <InputLabel id="select-multiple-agent">Select Agent:</InputLabel>
        <Select
          labelId="select-multiple-agent"
          id="select-multiple-agent"
          multiple
          value={selectedAgents}
          onChange={handleMultipleAgentChange}
          input={<OutlinedInput label="Name" />}
          
        >
          {agents.map((agent) => (
            <MenuItem
              key={agent}
              value={agent}
            >
              {agent}
            </MenuItem>
          ))}
        </Select>


    <Box mt={2}>
    <Button onClick ={() => addproperty()} variant="contained" color="primary" >
    Add Property</Button>
    </Box>
    </Box>
    </>
  )
}

export default AddProperty;
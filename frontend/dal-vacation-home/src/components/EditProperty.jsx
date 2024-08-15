import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import Header from './Header';
import { getUser } from '../util/user-authentication/AuthenticationUtil';

const EditProperty = () => {    
    const [properties, setProperties] = useState([]);
    const [editingProperty, setEditingProperty] = useState(null);
    const [user,setUser ] = useState(null);
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const userData = getUser();
                console.log("Edit Property user data:",userData);
                // const userData = {"email": "abcd@example.com",
                //     "firstname": "ABCD",
                //     "lastname": "EFGH",
                //     "role": "agent"};
                setUser(userData);
                const response = await axios.get(`https://vrnylsjiye.execute-api.us-east-1.amazonaws.com/prod/property`); 
                console.log("Properties data fetched in edit properties:",response);
                if( response.data.Items.length > 0){
                    const transformedProperties = response.data.Items.map(item => ({
                        propertyId: item.propertyId?.S || '',
                        roomType: item.roomType?.S || '',
                        roomNumber: item.roomNumber?.N || -1,
                        occupancy: item.occupancy?.N || -1,
                        ownerId: item.ownerId?.S || '',
                        agentPool: item.agentPool?.S || '',
                        features: cleanString(item.features?.S) || '',
                        price: item.price?.N || -1 
                    }));
                    const filteredProperties = transformedProperties.filter(property => property.ownerId === userData.email);
                    setProperties(filteredProperties);
                }
                else {
                    setProperties([]);
                }
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();
    }, []);

    const handleEditClick = (property) => {
        setEditingProperty(property);
    };
    const cleanString = (str) => {
        if(str!== null && str!== undefined) {
        console.log('String:',str.replace(/[\[\]\']+/g,"").trim(),typeof(str));
        return str.replace(/[\[\]\']+/g,'').trim();
        }
        
    }
    const handleSave = async () => {
        try {
            const response = await axios.post('https://vrnylsjiye.execute-api.us-east-1.amazonaws.com/prod/property', editingProperty, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                setProperties(prevProperties =>
                    prevProperties.map(prop =>
                        prop.propertyId === editingProperty.propertyId ? editingProperty : prop
                    )
                );
                setEditingProperty(null);
            }
        } catch (error) {
            console.error('Error saving property:', error);
        }
    };

    const handleCancel = () => {
        setEditingProperty(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingProperty(prevProperty => ({
            ...prevProperty,
            [name]: value
        }));
    };

    return (
        <>
            <Header user={user}/>
            <Box mt={3}>
                <Grid container spacing={3}>
                    {properties.map((property) => (
                        <Grid item xs={12} sm={6} md={4} key={property.propertyId}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{property.roomType}</Typography>
                                    <Typography>Agent Pool: {property.agentPool}</Typography>
                                    <Typography>Room Number: {property.roomNumber}</Typography>
                                    <Typography>Occupancy: {property.occupancy}</Typography>
                                    <Typography>Owner: {property.ownerId}</Typography>
                                    <Typography>Price: {property.price}</Typography>
                                    <Typography>Features: {cleanString(property.features)}</Typography>
                                    <Button onClick={() => handleEditClick(property)} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                                        Edit
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {editingProperty && (
                <Box mt={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Edit Property</Typography>
                            <TextField
                                label="Room Type"
                                name="roomType"
                                value={editingProperty.roomType}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Agent Pool"
                                name="agentPool"
                                value={editingProperty.agentPool}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Room Number"
                                name="roomNumber"
                                value={editingProperty.roomNumber}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Occupancy"
                                name="occupancy"
                                value={editingProperty.occupancy}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Owner ID"
                                name="ownerId"
                                value={editingProperty.ownerId}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Price"
                                name="price"
                                value={editingProperty.price}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Features"
                                name="features"
                                value={editingProperty.features}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <Box mt={2}>
                                <Button onClick={handleSave} variant="contained" color="primary">
                                    Save
                                </Button>
                                <Button onClick={handleCancel} variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
                                    Cancel
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </>
    );
};

export default EditProperty;

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Heading, Text, Image, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator } from '@chakra-ui/react'
import UserList from './UserList';

const UserInformation = () => {
    const [deviceId, setDeviceId] = useState('');
    const [photo, setPhoto] = useState(null);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(null);
    const [flag, setFlag] = useState(false);
    const demoData = useSelector((state) => state)
    const { isLoading } = useSelector((state) => state)

    console.log(demoData)

    const dispatch = useDispatch()

    const handleCapturePhoto = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement('video');
            video.srcObject = stream;
            await video.play();

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const photoDataUrl = canvas.toDataURL('image/jpeg');
            setPhoto(photoDataUrl);

            video.srcObject.getTracks().forEach((track) => track.stop());
        } catch (error) {
            console.error('Error capturing photo:', error);
        }
    };


    const fetchDeviceId = () => {
        const id = window.navigator.userAgent;
        setDeviceId(id);
    };

    const fetchLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
            },
            (error) => {
                if (error.code === 1) {
                    console.error('Geolocation permission was denied.');
                    alert('please grant or re-grant geolocation permission in your browser settings.');
                } else {
                    console.error('Error fetching location:', error.message);
                }
            }
        );
    };



    const saveUserInfo = async () => {
        if (!deviceId || !photo || !latitude || !longitude) {
            setFlag(false);
            setSaveSuccess(false);
            return;
        }

        
        try {
            dispatch({ type: 'LOADING', payload: true })
            const response = await fetch('https://httpbin.org/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    deviceid: deviceId,
                    photo: photo,
                    lat: latitude,
                    log: longitude,
                }),
            });

            const data = await response.json();
            if (data) {
                setFlag(true);
                dispatch({ type: 'SAVE_USER_INFO', payload: [...demoData.userInfo, data] });
                setDeviceId('');
                setPhoto(null);
                setLatitude('');
                setLongitude('');
            }
            console.log(data);
            setSaveSuccess(data.success);
        } catch (error) {
            dispatch({ type: 'LOADING', payload: false })
            console.error('Error saving user information:', error);
            setFlag(false);
        }
    };

    return (
        <Tabs align='center' size='md' variant='enclosed' color='white'>
            <TabList>
                <Tab>User Information</Tab>
                <Tab>User List</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <>
                        <Flex color='white' m='10px auto' justify='space-evenly' flexDirection={{ base: 'column', sm: 'column', lg: 'row' }}>
                            <Flex border='1px solid white' flexDirection='column' w={{ base: '100%', sm: '80%', lg: '30%' }} justify='center' align='center' p='2rem' gap='2rem'>
                                <Text fontSize='1.2rem'>Perform Operations</Text>
                                <Button onClick={handleCapturePhoto}>Capture Photo</Button>
                                <Button onClick={fetchDeviceId}>Fetch Device ID</Button>
                                <Button onClick={fetchLocation}>Fetch Location</Button>
                            </Flex>

                            <Box w={{ base: '100%', sm: '80%', lg: '30%' }} border='1px solid white' p='10px' borderRadius='1rem'>
                                <Box textAlign='center' m='auto'>
                                    {photo ?
                                        <Image w={{ base: '100%', sm: '100%', lg: '100%' }} h='300px' border='1px solid white' mb='1rem' src={photo} alt="Captured" />
                                        : <Flex m=' 10px auto' justify='center' alignItems='center' border='1px solid white' w={{ base: '100%', sm: '100%', lg: '100%' }} h='300px'>
                                            <Text fontSize='1.2rem'>Capture Photo</Text>
                                        </Flex>
                                    }

                                </Box>
                                <Box textAlign='center'>

                                    {deviceId ?
                                        <Text w='100%' textAlign='left'><b>Device ID:</b> {deviceId}</Text>
                                        : <Text w='100%' textAlign='left'><b>Device ID:</b></Text>
                                    }
                                </Box>
                                <Box textAlign='center'>
                                    {latitude && longitude ? (
                                        <>
                                            <Text textAlign='left'>
                                                <b>Latitude:</b> {latitude}
                                            </Text>
                                            <Text textAlign='left'>
                                                <b>Longitude:</b> {longitude}
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <Text textAlign='left'>
                                                <b>Latitude:</b>
                                            </Text>
                                            <Text textAlign='left'>
                                                <b>Longitude:</b>
                                            </Text>
                                        </>
                                    )}
                                </Box>
                                <Box textAlign='center' p='20px 0px 10px 0px'>
                                    {
                                        isLoading ?
                                        <Button isLoading loadingText='Submitting' colorScheme='teal' variant='outline'>
                                                Submit
                                            </Button>
                                            : 
                                            <Button onClick={saveUserInfo} w='full' colorScheme='facebook'>Save User Information</Button>
                                    }
                                    {saveSuccess !== null && (
                                        <Text>
                                            {flag
                                                ? ''
                                                : 'User information not saved'
                                            }
                                        </Text>
                                    )}
                                </Box>
                            </Box>
                        </Flex>
                    </>
                </TabPanel>
                <TabPanel>
                    <UserList />
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};
export default UserInformation;

import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardHeader, CardBody, CardFooter, Image, Stack, Heading, Text, Button, Box } from '@chakra-ui/react'


const UserList = () => {
    const userInfoArray = useSelector((state) => state.userInfo);
    console.log(userInfoArray)

    return (
        <>
            <Stack w={{ base: '', sm: '', lg: '50%' }} spacing={5}>
                {userInfoArray.map((item, index) => (
                    <Card
                        direction={{ base: 'column', sm: 'row' }}
                        overflow='hidden'
                        variant='outline'
                        key={index}
                        color='white'
                    >
                        <Image
                            objectFit='cover'
                            maxW={{ base: '100%', sm: '200px' }}
                            src={item.json?.photo}
                            alt='Caffe Latte'
                        />

                        <Stack textAlign='left'>
                            <CardBody>
                                <Text py='2'>
                                    <b>Device ID:</b> {item.json?.deviceid}
                                </Text>
                                <Text py='2'>
                                    <b>Latitude:</b> {item.json?.lat}
                                </Text>
                                <Text py='2'>
                                    <b>Longitude:</b> {item.json?.log}
                                </Text>
                            </CardBody>

                            <CardFooter p='0'>
                            </CardFooter>
                        </Stack>
                    </Card>
                ))}
            </Stack>
        </>

    )
};

export default UserList;

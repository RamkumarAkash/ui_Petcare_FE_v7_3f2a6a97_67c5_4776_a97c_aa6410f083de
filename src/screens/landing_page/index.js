import React, { useEffect } from "react";
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import Container from "screens/container";
import { useNavigate } from "react-router-dom";
import Session from "shared/session";
const Component = (props) => {
    const Navigate = useNavigate();
    useEffect(() => {
        const loggedin = Session.Retrieve("isAuthenticated", true);
        if(!loggedin) Navigate("/login");
    }, [])
    return (
        <>
            <Container {...props} landingPage={true} >
                <Typography variant="header" component="div" noWrap sx={{ flexGrow: 1 }}>
                    This application is deployed on sandbox. Kindly follow below instructions for smooth experience:
                </Typography>
                <List dense={true}>
                    <ListItem>
                        <ListItemText primary="1. Click on left side menu links for navigating to pages in the application" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="2. Don't use browser refresh button" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="3. Don't use browser back button" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="4. To refresh the page or go to home page: You can use the 'App Url' provided in the project details, in code-wizard." />
                    </ListItem>
                </List>
            </Container>
        </>
    );
};
export default Component;
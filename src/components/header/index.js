import * as React from 'react';
import { IconButton, AppBar, Toolbar, Typography, CssBaseline, Avatar, Switch, Menu, MenuItem } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, Menu as MenuIcon, Person } from '@mui/icons-material';
import LogoIcon from "assets/Logo.png";
import { Image } from 'components';
import TimerSession from 'shared/useTimerSession';
import Session from 'shared/session';
import { useNavigate } from 'react-router-dom';

const Component = ({ open, onDrawerClicked }) => {
    const [themeName, setThemeName] = React.useState("Light");
    const [themeLabel, setThemeLabel] = React.useState("Dark");
    const [lastTheme] = TimerSession("theme");
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const navigate = useNavigate();
    const Open = Boolean(anchorEl);

    const onSwitchChanged = (e) => {
        let _thName = e.target.checked ? "Dark" : 'Light';
        let _thLabel = e.target.checked ? 'Light' : "Dark";
        setThemeLabel(_thLabel);
        setThemeName(_thName);
        Session.Store('theme', _thName);
    }

    React.useEffect(() => {
        if (lastTheme) {
            let _thLabel = lastTheme === 'Light' ? "Dark" : 'Light';
            setThemeName(lastTheme);
            setThemeLabel(_thLabel);
        }
    }, [lastTheme]);

    const onClickProfile = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const onCloseMenu = () => {
        setAnchorEl(null);
    };

    const logoutUser = () => {
        Session.Remove("isAuthenticated");
        Session.Remove("jwtToken");
        Session.Remove("userKey");
        Session.Remove("UserId");
        window.AlertPopup("warning", "You are logged out");
        navigate("/login");
    }


    return (
        <>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => onDrawerClicked()}>
                        {!open ? <MenuIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                    <Image sx={{ width: 40, height: 40, mr: 2 }} alt="logo" src={LogoIcon} />
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        XYZ Company
                    </Typography>
                    <Avatar
                        style={{ cursor: "pointer" }}
                        onClick={onClickProfile}
                    >
                    </Avatar>
                    <Menu
                        anchorEl={anchorEl}
                        open={Open}
                        onClose={onCloseMenu}
                    >
                        <MenuItem>Your Profile</MenuItem>
                        <MenuItem
                            onClick={logoutUser}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'brown',
                                    color: 'white',
                                }
                            }}
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Component;

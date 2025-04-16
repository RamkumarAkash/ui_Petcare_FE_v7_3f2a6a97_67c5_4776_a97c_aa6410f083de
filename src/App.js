import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import { Header, Container, Drawer, AlertMessage } from 'components';
import RouteItems from "./Routes";
import { DarkTheme, DefaultTheme, LightTheme, RedTheme, BlueTheme } from "./theme";
import TimerSession from "shared/useTimerSession";
import Helper from "shared/helper";
import "./App.css";

window.Busy = (bBool) => {
  var x = document.getElementById("busyloader");
  if (x) x.className = bBool ? "loader display-block" : "loader display-none";
};

window.AlertPopup = (type, msg) => {
  sessionStorage.setItem('alert', JSON.stringify({ msg, type }));
};

const Component = () => {
  const [open, setOpen] = React.useState(false);
  const [customTheme, setCustomTheme] = React.useState(LightTheme);
  const [theme] = TimerSession('theme');
  const [isAuthenticated] = TimerSession('isAuthenticated');

  const OnDrawerClicked = () => { setOpen(!open); }

   return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          {Helper.ToBool(isAuthenticated) ? (
            <>
              <Header open={open} onDrawerClicked={OnDrawerClicked} />
              <Drawer open={open} />
              <Container open={open}>
                <RouteItems />
              </Container>
            </>
          ) : (
            <RouteItems />
          )}
          <AlertMessage />
        </Box>
      </ThemeProvider>
    </>
  );
}

export default Component;
import * as React from "react";
import { useEffect, useState } from "react";
import authConfig from "config/authConfig.json";
import { useNavigate } from "react-router-dom";
import { GenerateOTP, LoginUser, SignupUser} from "shared/services";
import LogoIcon from "assets/Logo.png";
import { Image } from "components";
import { OTPForm, RenderAuthControls } from "./childs";
import session from "shared/session";
import poster from "assets/poster.svg";
import { ValidatorForm } from 'react-material-ui-form-validator';
import { Box, Typography, Stack, Button } from '@mui/material';

const Component = (props) => {
  const [row, setRow] = useState({});
  const [newRow, setNewRow] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [OTPform,setOTPform] = useState(false);
  const form = React.useRef(null);

  const navigate = useNavigate();
  
  const OnInputChange = (e) => {
    setNewRow((prev) => ({
        ...prev,
        [e.name]: e.value
    }));
  }

  if (initialized) {
      setInitialized(false);
      ['signup'].forEach(elm => {
          for (let prop of authConfig[elm]) {
              delete prop['value'];
          }
      });
      setNewRow((prev) => ({
        ...prev,
        type : 'email'
      }));
      setRow({ 
        ...authConfig,signup : authConfig['signup']
        .filter(x => x.key !== 'mobileNumber') 
      });
  }

  useEffect(() => {
      setInitialized(true);
  }, []);

  const OnSubmit = async () => {
    const { mobileNumber, email, type, password } = newRow;

    const payload = { userName: newRow[type], [type]: newRow[type], password: password };
    window.Busy(true);
    const res = await SignupUser(payload);
    if(res.status){
      setNewRow((prev) => ({
          ...prev, user: res.values
      }));
      session.Store("userId",res.values.userId);
      const GRes = await GenerateOTP(res.values.userId,type,{email, mobileNumber});
      window.Busy(false);
      if(GRes.status){
        setOTPform(true);
      }
    }else{
      window.Busy(false);
      window.AlertPopup("error", res.statusText);
    }
  }

  const OnSubmitForm = (e) => {
    e.preventDefault();
    form.current.submit();
  }
  
   const handleConfirmOTP = async (otp) => {
       const { email, mobile, password, type } = newRow;
       window.Busy(true);
       const res = await VerifyOTP({type : type.toUpperCase(), otp});
       window.Busy(false);
       if(res.status){
          const loginRes = await LoginUser({ userName: newRow[type], password: password });
          window.Busy(false);
          if(loginRes.status){
            session.Store("isAuthenticated",true);
            session.Store("jwtToken",loginRes.values.token);
            //  const userRes = await SetUserSingle({EmailId:newRow.Email});
            //  const beUserId = userRes.id;
            //  session.Store("UserId", beUserId);
            navigate(`/Petcare_FE_v7/html`);
            window.AlertPopup("success", "You are signed up successfully!");
          }
         } else {
           window.AlertPopup("error", "Invalid OTP please try again");
         }

  };

  useEffect(() => {
    ValidatorForm.addValidationRule('isStrongPassword', (value) => {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&])[A-Za-z\d@$%*?&]{8,}$/.test(value);
    });
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      return value === newRow.password;
    });
    return () => {
      ValidatorForm.removeValidationRule('isStrongPassword');
      ValidatorForm.removeValidationRule('isPasswordMatch');
    };
  }, [newRow.password]);
  
  const onCloseOTP = () => {
    setOTPform(false)
  }

  const onChangeType = () => {
    const { type } = newRow;
    const filtConfig = authConfig['signup'].filter(x => x.key !== type);
    setRow({ ...authConfig, signup: filtConfig });
    setNewRow((prev) => ({
        ...prev,
        ... { type : type === 'email' ? 'mobileNumber' : 'email', [type] : "" }
    }));
  }

  return (
    <Stack direction="row">
        <Image sx={{ width: "49%", minHeight: "100vh" }} alt="App" src={poster} />
        {OTPform ? (
          <OTPForm  onCloseOTP={onCloseOTP} onSubmit={handleConfirmOTP} row={newRow} type={newRow.type} />
        ) : (
         <Stack direction="column" alignItems="center" justifyContent="center" gap={2} sx={{ width:"460px", mx:"auto", pb: 1 }}>
             <Image sx={{ width: 190, height: 100, mr: 2 }} alt="logo" src={LogoIcon} />
              <Typography variant="h5" component="div" sx={{ fontWeight:"bold" }}>
                Signup via Email or Mobile Number
              </Typography>
              <Typography variant="inherit">
                We’ll send a verification code to your email or Mobile Number, which you can enter on the following screen.
              </Typography>
              <ValidatorForm ref={form} onSubmit={OnSubmit}>
                <Box style={{ display: 'flex', width: '100%' }}>
                  <Stack direction="column" sx={{ width: "100%", margin: 2 }}>
                    <RenderAuthControls controls={row.signup} onInputChange={OnInputChange} />
                  </Stack>
                </Box>
                <Button variant="contained" sx={{ width: "100%" }} onClick={(e) => OnSubmitForm(e)}>
                  Signup
                </Button>
              </ValidatorForm>
               <Button color="secondary" onClick={onChangeType}>
                  Signup with {newRow.type === "email" ? "mobileNumber" : "email"}
                </Button>
               <Typography variant="inherit" onClick={() => navigate("/")} sx={{cursor:"pointer"}}>
                Login
              </Typography>
          </Stack> 
        )}
    </Stack>
  )
}

export default Component
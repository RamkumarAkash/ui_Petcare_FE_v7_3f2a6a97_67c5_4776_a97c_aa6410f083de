import * as React from "react";
import { useEffect, useState } from "react";
import authConfig from "config/authConfig.json";
import { useNavigate } from "react-router-dom";
import { GenerateOTP, LoginUser, SignupUser} from "shared/services";
import LogoIcon from "assets/Logo-ref.svg";
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

  if(OTPform) return <OTPForm  onCloseOTP={onCloseOTP} onSubmit={handleConfirmOTP} row={newRow} type={newRow.type} />
  
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ height: "100vh",  background: 'linear-gradient(to right, white 70%, rgba(25, 118, 210, 0.1) 30%)' }}>     
      <>
        <Image sx={{ width: "40%" }} alt="App" src={poster} />
        <Stack direction="column" alignItems="start" justifyContent="center" gap={3} 
            sx={{ maxWidth: "620px", borderRadius: '10px', boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)", m: 'auto', p: '38px 62px', bgcolor: 'white' }}>
          <Image sx={{ width: '77px' }} alt="logo" src={LogoIcon} />
          <Typography variant="h5" component="div" sx={{ fontWeight: "medium" }}>
            Create An Account
          </Typography>

          <ValidatorForm ref={form} onSubmit={OnSubmit}>
            <Box style={{ display: 'flex', width: '100%' }}>
              <Stack direction="column" sx={{ width: "100%", margin: 2 }}>
                <RenderAuthControls controls={row.signup} onInputChange={OnInputChange} />
              </Stack>
            </Box>
            
             <Button variant="contained" sx={{ width: "100%", borderRadius: "10px", py: '12px', fontWeight: 'medium', fontSize: '20px' }}
              onClick={(e) => OnSubmitForm(e)}
             >
               Signup
             </Button>
          </ValidatorForm>
          
          <Stack direction={'column'} gap={1} sx={{ width: '100%', alignItems: 'center'}}>
            <Typography variant="inherit">
            Already have an account? 
              <span onClick={() => navigate("/signup")} style={{ cursor: "pointer", color: '#1976D2', marginLeft: 8, fontWeight: 'bold' }}>
                Sign In
              </span>
            </Typography>
            <Typography variant="inherit" onClick={() => navigate("/signup")} sx={{ cursor: "pointer" }}>
              or
            </Typography>

            <Typography variant="inherit">
              Sign up with
              <span onClick={onChangeType} style={{ cursor: "pointer", color: '#1976D2', marginLeft: 8, fontWeight: 'bold' }}>
                {newRow.type === "email" ? "Mobile Number" : "Email"}
              </span>
            </Typography>
          </Stack>
        </Stack>
      </>
    </Stack> 
  )
}

export default Component
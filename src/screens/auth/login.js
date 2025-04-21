import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authConfig from "config/authConfig.json";
import { ForgotPassword, GenerateOTP, LoginUser, ResetPassword } from "shared/services";
import LogoIcon from "assets/Logo-ref.svg";
import { Image } from "components";
import session from "shared/session";
import poster from "assets/poster.svg";
import { ValidatorForm } from 'react-material-ui-form-validator';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  TableContainer, Table, TableBody, TableCell, TableRow, Paper, Box, Typography, Stack, Button
} from '@mui/material';
import { TextInput } from "components";
import { OTPForm, RenderAuthControls } from "./childs";

const RenderLogin = ({ controls, type, setPasswordForm }) => {

  const [row, setRow] = useState({});
  const form = React.useRef(null);
  const Navigate = useNavigate();

  const handleSubmit = async () => {
    window.Busy(true);
    const res = await LoginUser({ userName: row[type], password: row.Password });
    window.Busy(false);
    if (res.status) {
      session.Store("isAuthenticated", true);
      session.Store("jwtToken", res.values.token);
      session.Store("userKey", row.userKey);
      // const resp = await GetUsersMulti(`$filter=EmailId eq '${row.Email}'`, null);
      // if (resp.status) {
      //   const [userDetail] = resp.values;
      //   session.Store("UserId", userDetail?.UserId);
      //   Navigate('/events/tiles');
      //   if (userDetail?.UserProfilePhoto)
      //     session.Store("ProfilePhotoId", userDetail.UserProfilePhoto)
      //   window.AlertPopup("success", "You are logged in successfully!");
      // }
      Navigate('/Petcare_FE_v7/html');
      window.AlertPopup("success", "You are logged in successfully!");
    } else {
      window.AlertPopup("error", res.statusText);
    }
  }

  const OnInputChange = (e) => {
    setRow((prev) => ({ ...prev, [e.name]: e.value }));
  }

  const OnSubmitForm = (e) => {
    e.preventDefault();
    form.current.submit();
  }

  return (
    <Box sx={{ width: '100%' }}>
      <ValidatorForm ref={form} onSubmit={handleSubmit}>
        <Box style={{ display: 'flex', width: '100%' }}>
          <Stack direction="column" sx={{ margin: 2 }}>
            <RenderAuthControls controls={controls} onInputChange={OnInputChange} />
          </Stack>
        </Box>
        <Typography variant="inherit" onClick={() => setPasswordForm(true)} sx={{ cursor: "pointer", textAlign: 'right', marginBottom: 4, color: '#9747FF', fontWeight: 'medium'}}>
          Forgot Password?
        </Typography>
        <Button variant="contained" sx={{ width: "100%", borderRadius: "10px", py: '12px', fontWeight: 'medium', fontSize: '20px', textTransform: "unset" }}
         onClick={(e) => OnSubmitForm(e)} >
          Sign In
        </Button>
      </ValidatorForm>
    </Box>
  )

}

const RenderForgotPassword = ({ controls, onCancelReset }) => {
  const [initialized, setInitialized] = useState(false);
  const [row, setRow] = useState({});
  const [newRow, setNewRow] = useState({});
  const [resetPasswordForm,setResetPasswordForm] = useState(false);
  const [OTPform, setOTPform] = useState(false);

  const form = React.useRef(null);
  
  if (initialized) {
    setInitialized(false);
    ['forgotPassword'].forEach(elm => {
        for (let prop of authConfig[elm]) {
            delete prop['value'];
        }
    });
    setNewRow((prev) => ({
      ...prev,
      type : 'email'
    }));
    setRow({ 
      ...authConfig,forgotPassword : authConfig['forgotPassword']
      .filter(x => x.key !== 'mobileNumber') 
    });
}

useEffect(() => {
    setInitialized(true);
}, []);

  const OnCancelReset = () => {
    if (onCancelReset) onCancelReset();
  };

  const onSubmit = async () => {
    const { type } = newRow;
      window.Busy(true);
      const res = await ForgotPassword({ type : type.toUpperCase(), value: newRow[type] });
      window.Busy(false);
      if (res.status) {
        session.Store("userId",res.values.userId);
        setOTPform(true);
      }else {
        window.AlertPopup("error", res.statusText);
      }
  }

  const OnInputChange = (e) => {
    setNewRow((prev) => ({ ...prev, [e.name]: e.value }));
  }

  const OnSubmitForm = (e) => {
    e.preventDefault();
    form.current.submit();
  }

  const handleOTPSubmit = (otp) => {
    setOTPform(false);
    setResetPasswordForm(true);
    session.Store("verifyData",{ type : newRow.type.toUpperCase(), otp }, true);
  }

  const onCloseOTP = () => {
     setOTPform(false)
  }

  const onCloseResetPwd = () => {
    OnCancelReset();
    setResetPasswordForm(false);
  }

  const onChangeType = () => {
    const { type } = newRow;
    const filtConfig = authConfig['forgotPassword'].filter(x => x.key !== type);
    setRow({ ...authConfig, forgotPassword: filtConfig });
    setNewRow((prev) => ({
        ...prev,
        ... { type : type === 'email' ? 'mobileNumber' : 'email', [type] : "" }
    }));
  }

  return (
    <>
      {OTPform ?  <OTPForm onCloseOTP={onCloseOTP} onSubmit={handleOTPSubmit} row={newRow} type={newRow.type} /> : 
        resetPasswordForm ? ( <RenderResetPassword controls={controls} email={newRow.Email} onCloseResetPwd={onCloseResetPwd} /> ) : (
          <Stack direction={'column'} sx={{ width: '100%', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', gap: '16px', bgcolor: 'rgba(255, 255, 255, 0.1)', py: 3}}>
            <Image sx={{ width: '77px' }} alt="logo" src={LogoIcon} />
            <Typography variant="h5" component="div" sx={{ fontWeight: "medium" }}>
              Welcome To Company Name
            </Typography>
            <Box sx={{ position: 'relative', maxWidth: '516px', display: 'flex', justifyContent: 'center', alignItems: 'center',borderRadius: '10px', boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)", p: '75px 63px', mt: '20px' }}>
                <Stack direction="column" sx={{ alignItems: 'center' }} gap={3}>
                <ValidatorForm ref={form} onSubmit={onSubmit}>
                    <Typography variant="h5" sx={{ fontWeight: 500, color: '#293241', textAlign: 'center', mb: '28px' }}>
                      Forgot Password
                    </Typography>
                    
                    <Typography variant="inherit" sx={{ color: '#000000', opacity: '80%', textAlign: 'center' }}>
                      Enter your Email and we’ll send a confirmation code to reset your password.
                    </Typography>
                    <Box style={{ display: 'flex', width: '100%' }}>
                      <Stack direction="column" sx={{ width: "100%", margin: '50px 0 30px 0',  }}>
                        <RenderAuthControls controls={row.forgotPassword} onInputChange={OnInputChange} />
                      </Stack>
                    </Box>
                    <Button variant="contained" sx={{ width: "100%", borderRadius: "10px", py: '12px', fontWeight: 'medium', fontSize: '20px', textTransform: "unset"}}
                      onClick={(e) => OnSubmitForm(e)}>
                      Send Code
                    </Button>
                </ValidatorForm>
                  <Typography variant="inherit" sx={{ mx: 'auto' }}>
                    Proceed with
                    <span onClick={onChangeType} style={{ cursor: "pointer", color: '#1976D2', marginLeft: 8, fontWeight: 'bold' }}>
                    {newRow.type === "email" ? "Mobile Number" : "email"}
                    </span>
                  </Typography>
                </Stack>
            </Box>
            <Typography variant="body1" sx={{ color: '#536075CC', mt: 2, textAlign: "center" }}>
              Need help? Email us support.company@gmail.com
            </Typography>
          </Stack>
      )}
    </>
  )
}

const RenderResetPassword = ({ controls, onCloseResetPwd }) => {
  const [row, setRow] = useState({});

  const form = React.useRef(null);

  const OnInputChange = (e) => {
    setRow((prev) => ({
      ...prev,
      [e.name]: e.value
    }));
  }

  const OnCloseResetPwd = () => {
    if (onCloseResetPwd) onCloseResetPwd();
  };

  const OnSubmit = async () => {
    const verifyData = session.Retrieve("verifyData", true);

    const payload = {
      newPassword: row.Password,
      verifyPassword: row.ConfirmPassword,
      ...verifyData
    }
    window.Busy(true);
    const res = await ResetPassword(payload);
    window.Busy(false);
    if (res.status) {
      window.AlertPopup("success", "Password updated successfully!");
      OnCloseResetPwd();
    } else {
      window.AlertPopup("error", res.statusText);
    }
  }

  const OnSubmitForm = (e) => {
    e.preventDefault();
    form.current.submit();
  }

  useEffect(() => {
    ValidatorForm.addValidationRule('isStrongPassword', (value) => {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&])[A-Za-z\d@$%*?&]{8,}$/.test(value);
    });
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      return value === row.Password;
    });
    return () => {
      ValidatorForm.removeValidationRule('isStrongPassword');
      ValidatorForm.removeValidationRule('isPasswordMatch');
    };
  }, [row.Password]);

  return(
    <>
        <Stack direction={'column'} sx={{ width: '100%', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', gap: '16px', bgcolor: 'rgba(255, 255, 255, 0.1)', border: "1px solid rgba(0, 0, 0, 0.25)"}}>
            <Image sx={{ width: '77px' }} alt="logo" src={LogoIcon} />
            <Typography variant="h5" component="div" sx={{ fontWeight: "medium" }}>
              Company Name
            </Typography>
            <Box sx={{ position: 'relative', maxWidth: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center',borderRadius: '10px', boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)", p: '75px 63px', mt: '37px' }}>
                <Stack direction="column" sx={{ alignItems: 'center' }} gap={3}>
                <ValidatorForm ref={form} onSubmit={OnSubmit}>
                    <Typography variant="h5" sx={{ fontWeight: 500, color: '#293241', textAlign: 'center', mb: '28px' }}>
                       Reset your password
                    </Typography>
                    
                    <RenderAuthControls controls={controls.resetPassword} onInputChange={OnInputChange} />
                    <Button variant="contained" sx={{ bgcolor: "#1976D2", color: "#fff", width: "100%",  borderRadius: "10px", py: '12px', fontWeight: 'medium', fontSize: '20px', textTransform: "unset", marginTop: "30px" }}
                     onClick={(e) => OnSubmitForm(e)}>
                      Confirm
                    </Button>
                </ValidatorForm>
                </Stack>
            </Box>
            <Typography variant="body1" sx={{ color: '#536075CC', mt: 2, textAlign: "center" }}>
              Need help? Email us support.company@gmail.com
            </Typography>
          </Stack>
    </>
  )
}

const Component = (props) => {
  const [row, setRow] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [passwordForm, setPasswordForm] = useState(false);
  const [type, setType] = useState("email");

  const navigate = useNavigate();

  const OnCancelReset = () => {
    setPasswordForm(false);
  };

  if (initialized) {
    setInitialized(false);

    ['login'].forEach(elm => {
      for (let prop of authConfig[elm]) {
        delete prop['value'];
      }
    });
    setRow({ 
      ...authConfig,login : authConfig['login']
      .filter(x => x.key !== 'mobileNumber') 
    });
  }

  useEffect(() => {
    setInitialized(true);
  }, []);
  
  
  const onChangeType = () => {
    const filtConfig = authConfig['login'].filter(x => x.key !== type);
    setRow({ ...authConfig, login: filtConfig });
    setType((prev) => (
        prev === 'email' ? 'mobileNumber' : 'email'
    ));
  }

  if(passwordForm) return <RenderForgotPassword controls={row} onCancelReset={OnCancelReset} />

  return (
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ height: "100vh",  background: 'linear-gradient(to right, rgba(255, 255, 255, 0.1) 70%, rgba(25, 118, 210, 0.1) 30%)', py: 3, overflow: 'auto' }}>     
        <>
          <Image sx={{ width: "40%" }} alt="App" src={poster} />
          <Stack direction="column" alignItems="start" justifyContent="center" gap={3} 
            sx={{ minWidth: "516px", borderRadius: '10px', boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)", m: 'auto', p: '38px 62px', bgcolor: 'white' }}>
            <Image sx={{ width: '77px' }} alt="logo" src={LogoIcon} />
            <Typography variant="h5" component="div" sx={{ fontWeight: "medium" }}>
              Welcome To Company Name
            </Typography>
            <RenderLogin controls={row.login} type={type} setPasswordForm={(e) => setPasswordForm(e)}/>
            <Stack direction={'column'} gap={1} sx={{ width: '100%', alignItems: 'center'}}>
              <Typography variant="inherit">
                Don’t have an account? 
                <span onClick={() => navigate("/signup")} style={{ cursor: "pointer", color: '#1976D2', marginLeft: 8, fontWeight: 'bold' }}>Signup</span>
              </Typography>
              <Typography variant="inherit" onClick={() => navigate("/signup")} sx={{ cursor: "pointer" }}>
                or
              </Typography>

              <Typography variant="inherit">
                Login with
                <span onClick={onChangeType} style={{ cursor: "pointer", color: '#1976D2', marginLeft: 8, fontWeight: 'bold' }}>
                  {type === "email" ? "Mobile Number" : "Email"}
                </span>
              </Typography>
            </Stack>
          </Stack>
        </>
      </Stack>
  )
}

export default Component
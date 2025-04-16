import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authConfig from "config/authConfig.json";
import { ForgotPassword, GenerateOTP, LoginUser, ResetPassword } from "shared/services";
import LogoIcon from "assets/Logo.png";
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

const RenderLogin = ({ controls, type }) => {

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
    <Box>
      <ValidatorForm ref={form} onSubmit={handleSubmit}>
        <Box style={{ display: 'flex' }}>
          <Stack direction="column" sx={{ margin: 2 }}>
            <RenderAuthControls controls={controls} onInputChange={OnInputChange} />
          </Stack>
        </Box>
        <Button variant="contained" sx={{ width: "100%" }} onClick={(e) => OnSubmitForm(e)}>
          Login
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
          <Box sx={{ position: 'relative', width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button sx={{ position: 'absolute', top: '20px', left: '20px' }}
             onClick={() => OnCancelReset()}
             >
              <ArrowBackIcon />
            </Button>
              <Stack direction="column" gap={3}>
              <ValidatorForm ref={form} onSubmit={onSubmit}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#293241' }}>
                    Reset your password
                  </Typography>
    
                  <Box style={{ display: 'flex', width: '100%' }}>
                    <Stack direction="column" sx={{ width: "100%", margin: 2 }}>
                      <RenderAuthControls controls={row.forgotPassword} onInputChange={OnInputChange} />
                    </Stack>
                  </Box>
                  <Button variant="contained" sx={{ width: "100%" }} onClick={(e) => OnSubmitForm(e)}>
                    Confirm
                  </Button>
              </ValidatorForm>
                <Button color="secondary" onClick={onChangeType}>
                  Proceed with {newRow.type === "email" ? "mobileNumber" : "email"}
                </Button>
                <Typography variant="body1" sx={{ color: '#536075CC', mt: 2, textAlign: "center" }}>
                  Need help? Email us meetups@gmail.com
                </Typography>
              </Stack>
          </Box>
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
    <Box sx={{ position: 'relative', width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Button sx={{ position: 'absolute', top: '20px', left: '20px' }} onClick={() => OnCloseResetPwd()}>
        <ArrowBackIcon />
      </Button>
      <ValidatorForm ref={form} onSubmit={OnSubmit}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#293241' }}>
            Reset your password
          </Typography>
          <RenderAuthControls controls={controls.resetPassword} onInputChange={OnInputChange} />
          <Button variant="contained" sx={{ bgcolor: "#2E2E2E", color: "#fff", width: "100%" }} onClick={(e) => OnSubmitForm(e)}>
            CONFIRM
          </Button>
          <Typography variant="body1" sx={{ color: '#536075CC', mt: 2, textAlign: "center" }}>
            Need help? Email us meetups@gmail.com
          </Typography>
        </Box>
      </ValidatorForm>
    </Box>
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

  return (
    <Stack direction="row">
      <Image sx={{ width: "49%", height: "100vh" }} alt="App" src={poster} />
      {passwordForm ? (
        <RenderForgotPassword controls={row} onCancelReset={OnCancelReset} />
      ) : (
        <Stack direction="column" alignItems="center" justifyContent="center" gap={3} sx={{ width: "540px", mx: "auto" }}>
          <Image sx={{ width: 190, height: 100 }} alt="logo" src={LogoIcon} />
          <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
            Welcome Back
          </Typography>
          <RenderLogin controls={row.login} type={type} />
          <Button color="secondary" onClick={onChangeType}>
            Login with {type === "email" ? "mobileNumber" : "email"}
          </Button>
          <Typography variant="inherit" onClick={() => setPasswordForm(true)} sx={{ cursor: "pointer" }}>
            forgot Password?
          </Typography>
          <Typography variant="inherit" onClick={() => navigate("/signup")} sx={{ cursor: "pointer" }}>
            Signup
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}

export default Component
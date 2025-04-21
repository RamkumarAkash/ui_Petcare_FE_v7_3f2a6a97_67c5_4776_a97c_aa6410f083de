import React, { useState, useRef } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Stack, Typography, Button } from '@mui/material';
import LogoIcon from "assets/Logo-ref.svg";
import { Image } from "components";

const Component = (props) => {
  const { onSubmit, row, onCloseOTP, type } = props;

  const [otp, setOtp] = useState('');
  const inputsRef = useRef([]);

  const OnCloseOTP = () => {
    if(onCloseOTP) onCloseOTP();
  };

  const handleOtpInputChange = (index, e) => {
    const value = e.target.value;
    
    const updatedOtpValue = [...otp];
    updatedOtpValue[index] = value;
  
    setOtp(updatedOtpValue.join(''));
  
    const nextInput = inputsRef.current[index + 1];
    if (value.length === 1 && nextInput) {
      nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && !e.target.value) {
      inputsRef.current[index - 1].focus();
    }
    
    inputsRef.current.forEach(input => {
        input.style.borderColor = "#D9D9D9";
    });    
  };
    
  const handleSubmit = async () => {
    if (otp.split('').length === 4) {
      if (onSubmit) onSubmit(otp);
    } else {
      window.AlertPopup("error", "Please enter your OTP");
    }
  }

  const resendOTP = async () => {
    window.Busy(true);
    const res = await GenerateOTP(row[type]);
    window.Busy(false);
    if(res.status){
      window.AlertPopup("success", "OTP sent to your mail successfully");
    }else{
      window.AlertPopup("error", "Something went wrong while sending record!");
    }
  }

  return (
    <Stack direction={'column'} sx={{ width: '100%', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', gap: '16px', bgcolor: 'rgba(255, 255, 255, 0.1)'}}>
      <Image sx={{ width: '77px' }} alt="logo" src={LogoIcon} />
      <Typography variant="h5" component="div" sx={{ fontWeight: "medium" }}>
        Welcome To Company Name
      </Typography>
      <Box sx={{ position: 'relative', maxWidth: '516px', display: 'flex', justifyContent: 'center', alignItems: 'center',borderRadius: '10px', boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)", p: '75px 63px', mt: '20px' }}>
        <Stack direction="column" gap={3}>
            <Typography variant="h4" sx={{ fontWeight: 500 }}>
              Verify Code
            </Typography>
            <Typography variant="body1">
              Code is sent to {row?.Email}        
            </Typography>
            <Typography variant="body1" sx={{ color: '#536075CC' }}>
              We have sent a 4-digit OTP to your registered email or mobile number
            </Typography>

            <Box style={{ display: 'flex', alignItems: 'center',justifyContent:"center", margin: "16px 0" }}>
              {Array.from({ length: 4 }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="tel"
                  pattern="\d*"
                  inputMode="numeric"
                  maxLength="1"
                  value={otp[index] || ''}
                  onChange={(e) => handleOtpInputChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{
                    width: '52px',
                    marginRight: '25px',
                    height: "52px",
                    borderRadius: "10px",
                    border: '1px solid #D9D9D9',
                    textAlign: 'center',
                  }}
                />
              ))}
            </Box>

            <Button variant="contained" sx={{ width: "100%", borderRadius: "10px", py: '12px', fontWeight: 'medium', fontSize: '20px', textTransform: 'unset' }}
             onClick={handleSubmit}>
              Confirm
            </Button>
            <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="inherit">
                 Didn’t receive a code? 
                 <span style={{ cursor: "pointer", color: '#1976D2', marginLeft: 8, fontWeight: 'bold' }}
                  onClick={resendOTP}
                 >
                  Resend
                 </span>
              </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  )
}

export default Component;
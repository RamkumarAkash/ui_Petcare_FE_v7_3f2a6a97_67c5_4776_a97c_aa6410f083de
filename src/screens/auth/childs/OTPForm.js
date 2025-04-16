import React, { useState, useRef } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Stack, Typography, Button } from '@mui/material';

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
      <Box sx={{ position: 'relative', width: '50%', bgcolor: '#f7f9fd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Button onClick={() => OnCloseOTP()} sx={{ position: 'absolute', top: '20px', left: '20px'}}>
        <ArrowBackIcon />
      </Button>
        <Stack direction="column" gap={3} sx={{ width: "85%", borderRadius: "13px", bgcolor: 'white', padding: '40px' }}>
            <Typography variant="h4"sx={{ fontWeight: 500 }}>
              Verify Code
            </Typography>
            <Typography variant="body1">
              Code is sent to {row?.Email}        
            </Typography>
            <Typography variant="body1" sx={{ color: '#536075CC' }}>
              We have sent a 4-digit OTP to your registered email or mobile number
            </Typography>

            <Box style={{ display: 'flex', alignItems: 'center',justifyContent:"center", marginTop: "10px" }}>
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
                    width: '40px',
                    marginRight: '25px',
                    height: "40px",
                    borderRadius: "5px",
                    border: '1px solid #D9D9D9',
                    textAlign: 'center',
                  }}
                />
              ))}
            </Box>

            <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#2E2E2E', width:"350px", mx:'auto', my:2 }}>
              Confirm OTP
            </Button>
            <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ color: '#536075CC' }}>
                Need help? Email us meetups@gmail.com
              </Typography>
              <Typography variant="body1" sx={{ cursor:"pointer" }}
               onClick={resendOTP}
              >
                Resend Code
              </Typography>
          </Box>
        </Stack>
      </Box>
  )
}

export default Component;
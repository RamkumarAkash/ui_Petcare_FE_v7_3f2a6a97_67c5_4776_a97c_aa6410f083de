import * as React from "react";
import {
  TableContainer, Table, TableBody, TableCell, TableRow,
   Paper, Typography,} from '@mui/material';
import { TextInput } from "components";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const Component = (props) => {
    const { controls, onInputChange } = props;
    const paddingTop = 3;
  
    const OnInputChange = (e) => {
      if (onInputChange) onInputChange(e);
    }
  
    return (
      <>
        <TableContainer component={Paper} sx={{ boxShadow: 0, width: "100%" }}>
          <Table sx={{ width: '100%', border: 0 }}>
            <TableBody>
              {controls && controls.filter((z) => !z.nocreate).map((x, i) => {
                return (
                  <TableRow key={i}>
                    {x.label && (
                      <TableCell align="right" sx={{ verticalAlign: "top", paddingTop, border: 0, whiteSpace: "nowrap" }}>
                        <Typography nowrap="true" variant="labelheader">{x.label}<span style={{ color: "brown" }}>&nbsp;*</span></Typography>
                      </TableCell>
                    )}
                    <TableCell sx={{ border: 0, width: "100%" }}>
                      {x.type === 'text' && (
                        <TextInput id={x.key} name={x.key} validators={x.validators}
                          validationMessages={x.validationMessages} OnInputChange={OnInputChange} sx={{ width: "100%" }} editable={x.editable} />
                      )}
                      {x.type === 'password' && (
                        <TextInput id={x.key} type={x.type} name={x.key} validators={x.validators}
                          validationMessages={x.validationMessages} OnInputChange={OnInputChange} sx={{ width: "100%" }} editable={x.editable} />
                      )}
                      {x.type === 'mobilenumber' && (
                        <PhoneInput id={x.key} name={x.key} defaultCountry="IN" onChange={e => onInputChange({ name: x.key, value: e })}
                          international countryCallingCodeEditable={false} />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  
  }

  export default Component;
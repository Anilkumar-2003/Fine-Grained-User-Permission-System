import { forwardRef } from "react";
import { TextField } from "@mui/material";

const AuthInput = forwardRef(
  ({ error, helperText, InputProps, sx, ...props }, ref) => {
    return (
      <TextField
        ref={ref}                     
        error={error}
        helperText={helperText}
        InputProps={InputProps}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#FFFFFF", 
          },
          "& fieldset": {
            border: error
              ? "0.08rem solid #FF0505"
              : "0.08rem solid #ccc",

          },
          ...sx,
        }}

        {...props}
      />
    );
  }
);

export default AuthInput;

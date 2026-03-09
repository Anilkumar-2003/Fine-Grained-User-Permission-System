import { Typography } from "@mui/material";

const FormLabel = ({ children, sx, ...props }) => (
  <Typography
    sx={{
      fontFamily: "Poppins",
      fontSize: "clamp(1rem, 1vw, 1rem)",
      color: "#0B3C5D",
      ...sx,
    }}
    {...props}
  >
    {children}
  </Typography>
);

export default FormLabel;

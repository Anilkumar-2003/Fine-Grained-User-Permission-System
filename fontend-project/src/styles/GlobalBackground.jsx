import { Box } from "@mui/material";
import bgImage from "../assets/bg.png";

export default function GlobalBackground({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",        
        backgroundPosition: "center",   
        backgroundRepeat: "no-repeat",
        backgroundAttachment: {
          md: "fixed",                 
          xs: "scroll",
        },
        position: "relative",

        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../auth/AuthContext";

import profileImg from "../assets/profile.png";

export default function Header() {

  const navigate = useNavigate();
  const { permissions } = useContext(AuthContext);

  const hasPermission = (perm) =>
    permissions?.some((p) => p.code === perm);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  const goToProfile = () => {

    if (hasPermission("VIEW_SELF")) {
      navigate("/profile");
    }

  };

  return (

    <AppBar
      position="static"
      elevation={1}
      sx={{
        background: "white",
        color: "black",
        height: "4rem",
        justifyContent: "center"
      }}
    >

      <Toolbar>

        <Typography variant="h6">
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2
          }}
        >

          <Avatar
            src={profileImg}
            onClick={goToProfile}
            sx={{
              width: "2.5rem",
              height: "2.5rem",
              cursor: hasPermission("VIEW_SELF") ? "pointer" : "not-allowed",
              opacity: hasPermission("VIEW_SELF") ? 1 : 0.5
            }}
          />

          <IconButton
            onClick={handleLogout}
            color="error"
          >
            <LogoutIcon />
          </IconButton>

        </Box>

      </Toolbar>

    </AppBar>

  );

}
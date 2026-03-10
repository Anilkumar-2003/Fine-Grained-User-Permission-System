import { useState, useContext, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { SnackbarContext } from "../components/AppSnackbar";

import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack
} from "@mui/material";

export default function Login() {

  const navigate = useNavigate();
  const { loadPermissions } = useContext(AuthContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const passwordRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;

  const validateField = (name, value) => {

    let temp = { ...errors };

    if (name === "email") {
      if (!value) temp.email = "Email required";
      else if (!emailRegex.test(value))
        temp.email = "Enter valid email with .com";
      else delete temp.email;
    }

    if (name === "password") {
      if (!value) temp.password = "Password required";
      else if (value.length < 8)
        temp.password = "Password must be 8 characters";
      else delete temp.password;
    }

    setErrors(temp);
  };

  const validate = () => {

    let temp = {};

    if (!email) temp.email = "Email required";
    else if (!emailRegex.test(email))
      temp.email = "Enter valid email with .com";

    if (!password) temp.password = "Password required";
    else if (password.length < 8)
      temp.password = "Password must be 8 characters";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleLogin = async () => {

    if (!validate()) return;

    try {

      setLoading(true);

      const res = await axiosInstance.post("/api/login/", {
        email,
        password
      });

      const accessToken = res.data.access_token;
      const refreshToken = res.data.refresh_token;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      await loadPermissions();

      showSnackbar("Login successful", "success");

      navigate("/dashboard");

    } catch (error) {

      showSnackbar("Login failed", "error");

    } finally {
      setLoading(false);
    }
  };

  return (

    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        backgroundImage: "url('/login-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.06)"
        }
      }}
    >

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: 360,
          borderRadius: 4,
          backdropFilter: "blur(8px)",
          background: "rgba(255,255,255,0.18)",
          border: "1px solid rgba(255,255,255,0.25)",
          p: 3
        }}
      >

        <Stack spacing={0.5} mb={2}>

          <Typography
            variant="h5"
            fontWeight={600}
            color="#003465"
          >
            Login
          </Typography>

          <Typography
            sx={{
              color: "#333",
              fontSize: 13
            }}
          >
            Access your employee management dashboard
          </Typography>

        </Stack>

        <Stack spacing={1.2}>

          <Box>

            <Typography
              sx={{
                fontSize: 13,
                mb: 0.3,
                color: "#003465",
                fontWeight: 500
              }}
            >
              Email
            </Typography>

            <Box
              component="input"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") passwordRef.current.focus();
              }}
              sx={{
                width: "100%",
                height: 38,
                px: 1.5,
                borderRadius: 1,
                border: "1px solid #cfd8dc",
                outline: "none",
                fontSize: 14,
                backgroundColor: "rgba(255,255,255,0.9)"
              }}
            />

            {errors.email && (
              <Typography sx={{ fontSize: 11, color: "red", mt: 0.2 }}>
                {errors.email}
              </Typography>
            )}

          </Box>

          <Box>

            <Typography
              sx={{
                fontSize: 13,
                mb: 0.3,
                color: "#003465",
                fontWeight: 500
              }}
            >
              Password
            </Typography>

            <Box
              component="input"
              type="password"
              ref={passwordRef}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateField("password", e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
              sx={{
                width: "100%",
                height: 38,
                px: 1.5,
                borderRadius: 1,
                border: "1px solid #cfd8dc",
                outline: "none",
                fontSize: 14,
                backgroundColor: "rgba(255,255,255,0.9)"
              }}
            />

            {errors.password && (
              <Typography sx={{ fontSize: 11, color: "red", mt: 0.2 }}>
                {errors.password}
              </Typography>
            )}

          </Box>

        </Stack>

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            height: 40,
            backgroundColor: "#003465",
            "&:hover": {
              backgroundColor: "#00264d"
            }
          }}
          disabled={loading}
          onClick={handleLogin}
        >

          {loading ? (
            <CircularProgress size={18} sx={{ color: "white" }} />
          ) : (
            "Login"
          )}

        </Button>

      </Box>

    </Box>
  );
}
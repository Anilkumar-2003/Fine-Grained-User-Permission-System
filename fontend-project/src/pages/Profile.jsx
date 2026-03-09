import {
  Box,
  Paper,
  Grid,
  Stack,
  Avatar,
  Tabs,
  Tab,
  IconButton,
  Button
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import { useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import AuthInput from "../styles/AuthInput";
import FormLabel from "../styles/FormLabel";
import { AuthContext } from "../auth/AuthContext";
import { SnackbarContext } from "../components/AppSnackbar";
import { jwtDecode } from "jwt-decode";

import profileImg from "../assets/profile.png";

export default function Profile() {

  const { permissions } = useContext(AuthContext);
  const { showSnackbar } = useContext(SnackbarContext);

  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({});
  const [tab, setTab] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const hasPermission = (perm) =>
    permissions?.some((p) => p.code === perm);

  const canEdit = hasPermission("EDIT_EMPLOYEE");

  const fetchProfile = async () => {
    try {

      const token = localStorage.getItem("access_token");
      const decoded = jwtDecode(token);

      const res = await axiosInstance.get(
        `/api/my-permissions/?user_id=${decoded.user_id}`
      );

      setUser(res.data);
      setFormData(res.data);

    } catch (err) {
      console.log(err);
      showSnackbar("Failed to load profile", "error");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSave = async () => {

    try {

      const payload = {
        username: formData.username,
        email: formData.email,
        department: formData.department,
        designation: formData.designation
      };

      await axiosInstance.put(
        `/api/employees/${user.emp_id}/update/`,
        payload
      );

      setUser(formData);
      setEditMode(false);

      showSnackbar("Profile updated successfully", "success");

    } catch (err) {
      console.log(err);
      showSnackbar("Profile update failed", "error");
    }
  };

  return (

    <Box sx={{ p: 3, display: "flex", justifyContent: "flex-start" }}>

      <Paper sx={{ width: 900, overflow: "hidden" }}>

        <Box
          sx={{
            height: 180,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            px: 4,
            mt: -10
          }}
        >

          <Box sx={{ position: "relative" }}>

            <Avatar
              src={profileImg}
              alt="User"
              sx={{
                width: 150,
                height: 150,
                border: "5px solid white"
              }}
            />

            {canEdit && !editMode && (
              <IconButton
                onClick={() => setEditMode(true)}
                sx={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  background: "white",
                  boxShadow: 2
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}

          </Box>

        </Box>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{ mt: 3, px: 4 }}
        >
          <Tab label="Personal Details" />
          <Tab label="Professional Details" />
        </Tabs>

        <Box sx={{ p: 4 }}>

          {tab === 0 && (

            <Grid container spacing={3}>

              <Grid sx={{ xs: 12 }}>
                <Stack spacing={1}>
                  <FormLabel>Username</FormLabel>

                  <AuthInput
                    name="username"
                    value={editMode ? formData.username : user.username || ""}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{ readOnly: !editMode }}
                  />
                </Stack>
              </Grid>

              <Grid sx={{
                xs: 12

              }}>
                <Stack spacing={1}>
                  <FormLabel>Email</FormLabel>

                  <AuthInput
                    name="email"
                    value={editMode ? formData.email : user.email || ""}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{ readOnly: !editMode }}
                  />
                </Stack>
              </Grid>

              {/* {!editMode && (
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <FormLabel>Permissions</FormLabel>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {user.permissions?.map((perm) => (
                        <Chip
                          key={perm.id}
                          label={perm.name}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>

                  </Stack>
                </Grid>
              )} */}

            </Grid>
          )}


          {tab === 1 && (

            <Grid container spacing={3}>

              <Grid sx={{
                xs: 12, md: 6

              }}>
                <Stack spacing={1}>
                  <FormLabel>Department</FormLabel>

                  <AuthInput
                    name="department"
                    value={editMode ? formData.department : user.department || ""}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{ readOnly: !editMode }}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FormLabel>Designation</FormLabel>

                  <AuthInput
                    name="designation"
                    value={editMode ? formData.designation : user.designation || ""}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{ readOnly: !editMode }}
                  />
                </Stack>
              </Grid>

            </Grid>
          )}


          {editMode && (

            <Box mt={4} textAlign="right">

              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  backgroundColor: "#003465",
                  "&:hover": {
                    backgroundColor: "#00264d"
                  },
                  width: 180
                }}
              >
                Save Changes
              </Button>

            </Box>

          )}

        </Box>

      </Paper>

    </Box>
  );
}
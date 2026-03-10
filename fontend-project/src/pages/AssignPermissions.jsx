import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Button,
  Paper,
  TextField,
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";

import axiosInstance from "../api/axiosInstance";
import { SnackbarContext } from "../components/AppSnackbar";

function not(a, b) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a, b) {
  return a.filter((value) => b.includes(value));
}

export default function AssignPermissions() {

  const { showSnackbar } = useContext(SnackbarContext);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [permissions, setPermissions] = useState([]);
  const [assignedPermissions, setAssignedPermissions] = useState([]);

  const [checked, setChecked] = useState([]);


  useEffect(() => {
    const loadInitial = async () => {
      try {

        const userRes = await axiosInstance.get("/api/users/");

        const mappedUsers = userRes.data.map((u) => ({
          id: u.user_id,
          email: u.email,
        }));

        setUsers(mappedUsers);
        setSelectedUser(mappedUsers[0] || null);

        const permRes = await axiosInstance.get("/api/permissions/");

        const mappedPerms = permRes.data.map((p) => ({
          id: p.id,
          name: p.name,
        }));

        setPermissions(mappedPerms);

      } catch (err) {
        if (err?.response?.status !== 404) {
          showSnackbar("Failed to load permissions", "error");
        }

        console.error(err);
      }
    };

    loadInitial();
  }, []);



  useEffect(() => {

    if (!selectedUser) return;

    const loadUserPermissions = async () => {
      try {

        const res = await axiosInstance.get(
          `/api/getdetails/?email=${selectedUser.email}`
        );

        const userPerms = res.data.permissions || [];

        setAssignedPermissions(userPerms.map((p) => p.id));
        setChecked([]);

      } catch (err) {
        console.error(err);
        if (err?.response?.status !== 404) {
          showSnackbar("Failed to load permissions", "error");
        }
      }
    };

    loadUserPermissions();

  }, [selectedUser]);

  const leftPermissions = permissions.filter(
    (p) => !assignedPermissions.includes(p.id)
  );

  const rightPermissions = permissions.filter((p) =>
    assignedPermissions.includes(p.id)
  );

  const leftChecked = intersection(
    checked,
    leftPermissions.map((x) => x.id)
  );

  const rightChecked = intersection(
    checked,
    rightPermissions.map((x) => x.id)
  );

  const handleToggle = (id) => () => {

    setChecked((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const moveRight = () => {
    setAssignedPermissions([...assignedPermissions, ...leftChecked]);
    setChecked(not(checked, leftChecked));
  };

  const moveLeft = () => {
    setAssignedPermissions(not(assignedPermissions, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleSave = async () => {

    if (!selectedUser) return;

    try {

      const payload = {
        user_id: selectedUser.id,
        permission_ids: assignedPermissions,
      };

      await axiosInstance.post(
        "api/assign-permissions/",
        payload
      );

      showSnackbar("Permissions mapped successfully!", "success");

    } catch (err) {
      console.error(err);
      showSnackbar("Saving failed", "error");
    }
  };

  const customList = (items, title) => (
    <Paper sx={{ width: 300, height: 320, overflow: "auto", p: 1 }}>
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          bgcolor: "#f1f1f1",
          py: 1,
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <List dense>

        {items.map((item) => (
          <ListItemButton key={item.id} onClick={handleToggle(item.id)}>

            <ListItemIcon>
              <Checkbox checked={checked.includes(item.id)} />
            </ListItemIcon>

            <ListItemText primary={item.name} />

          </ListItemButton>
        ))}

      </List>
    </Paper>
  );

  return (
    <Box sx={{ p: 0 }}>

      {/* <Paper sx={{ p: 0, maxWidth: 1200, mx: "auto" }}> */}

      <Typography
        variant="h4"
        fontWeight={500}
        sx={{ color: "#003465", mb: 2 }}
      >
        Assign Permissions to User
      </Typography>


      <Autocomplete
        options={users}
        value={selectedUser}
        onChange={(e, v) => setSelectedUser(v)}
        getOptionLabel={(u) => u?.email ?? ""}
        sx={{ width: 350, mb: 3 }}
        renderInput={(params) => (
          <TextField {...params} label="Select User" />
        )}
      />


      <Grid container spacing={2} justifyContent="center">

        <Grid>{customList(leftPermissions, "Available Permissions")}</Grid>

        <Grid>
          <Grid container direction="column" alignItems="center">

            <Button
              sx={{
                backgroundColor: "#003465",
                my: 1
              }}
              variant="contained"
              disabled={leftChecked.length === 0}
              onClick={moveRight}
            >
              &gt;
            </Button>

            <Button
              sx={{
                backgroundColor: "#003465",
                my: 1
              }}
              variant="contained"
              disabled={rightChecked.length === 0}
              onClick={moveLeft}
            >
              &lt;
            </Button>

          </Grid>
        </Grid>

        <Grid>{customList(rightPermissions, "Assigned Permissions")}</Grid>

      </Grid>



      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={!selectedUser || assignedPermissions.length === 0}
          sx={{
            backgroundColor: "#003465",
            my: 1
          }}
        >
          Save Mapping
        </Button>
      </Box>

      {/* </Paper> */}

    </Box>
  );
}
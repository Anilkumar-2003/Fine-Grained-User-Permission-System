import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Stack
} from "@mui/material";

import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";
import { SnackbarContext } from "../components/AppSnackbar";
import { AuthContext } from "../auth/AuthContext";

import AuthInput from "../styles/AuthInput";
import FormLabel from "../styles/FormLabel";

export default function EditEmployee() {

  const { email } = useParams();
  const navigate = useNavigate();

  const { showSnackbar } = useContext(SnackbarContext);
  const { permissions } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    department: "",
    designation: ""
  });

  const [empId, setEmpId] = useState("");

  const hasPermission = (perm) =>
    permissions?.some((p) => p.code === perm);

  const canEdit = hasPermission("EDIT_EMPLOYEE");
  const canDelete = hasPermission("DELETE_EMPLOYEE");

  const fetchEmployee = async () => {

    try {

      const res = await axiosInstance.get(
        `/api/getdetails/?email=${email}`
      );

      const data = res.data;

      setEmpId(data.emp_id);

      setFormData({
        username: data.username || "",
        email: data.email || "",
        department: data.department || "",
        designation: data.designation || ""
      });

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const handleChange = (e) => {

    if (!canEdit) return;

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {

    if (!canEdit) return;

    try {

      await axiosInstance.put(
        `/api/employees/${empId}/update/`,
        formData
      );

      showSnackbar("Employee updated successfully", "success");

      navigate("/employees");

    } catch (err) {

      showSnackbar("Update failed", "error");
    }
  };

  const handleDelete = async () => {

    if (!canDelete) return;

    try {

      await axiosInstance.delete(
        `/api/employees/${empId}/delete/`
      );

      showSnackbar("Employee deleted successfully", "success");

      navigate("/employees");

    } catch (err) {

      showSnackbar("Delete failed", "error");
    }
  };

  return (

    <Box>

      <Typography
        variant="h4"
        fontWeight={500}
        sx={{ color: "#003465", mb: 3 }}
      >
        Employee Details
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 700 }}>

        <Grid container spacing={3}>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <FormLabel>Username</FormLabel>

              <AuthInput
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  readOnly: !canEdit
                }}
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <FormLabel>Email</FormLabel>

              <AuthInput
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  readOnly: !canEdit
                }}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <FormLabel>Department</FormLabel>

              <AuthInput
                name="department"
                value={formData.department}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  readOnly: !canEdit
                }}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <FormLabel>Designation</FormLabel>

              <AuthInput
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  readOnly: !canEdit
                }}
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
            >

              {canDelete && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                >
                  Delete Employee
                </Button>
              )}

              {canEdit && (
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  sx={{
                    backgroundColor: "#003465",
                    "&:hover": {
                      backgroundColor: "#00264d"
                    }
                  }}
                >
                  Update Employee
                </Button>
              )}

            </Stack>

          </Grid>

        </Grid>

      </Paper>

    </Box>
  );
}
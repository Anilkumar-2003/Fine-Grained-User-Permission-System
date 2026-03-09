import {
    Box,
    Typography,
    Button,
    Grid,
    Stack,
    IconButton,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useState, useContext, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { SnackbarContext } from "../components/AppSnackbar";

import AuthInput from "../styles/AuthInput";
import FormLabel from "../styles/FormLabel";

export default function AddEmployee() {

    const { showSnackbar } = useContext(SnackbarContext);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        department: "",
        designation: ""
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);

    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const departmentRef = useRef();
    const designationRef = useRef();

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        let tempErrors = { ...errors };

        if (name === "email") {
            if (!value) tempErrors.email = "Email required";
            else if (!emailRegex.test(value)) tempErrors.email = "Enter valid email";
            else delete tempErrors.email;
        }

        if (name === "password") {
            if (!value) tempErrors.password = "Password required";
            else if (value.length < 8) tempErrors.password = "Minimum 8 characters";
            else delete tempErrors.password;

            if (formData.confirmPassword && value !== formData.confirmPassword) {
                tempErrors.confirmPassword = "Passwords do not match";
            } else delete tempErrors.confirmPassword;
        }

        if (name === "confirmPassword") {
            if (value !== formData.password)
                tempErrors.confirmPassword = "Passwords do not match";
            else delete tempErrors.confirmPassword;
        }

        setErrors(tempErrors);
    };

    const validate = () => {

        let temp = {};

        if (!formData.email) temp.email = "Email required";
        if (!formData.password) temp.password = "Password required";
        if (!formData.confirmPassword) temp.confirmPassword = "Confirm password required";
        if (!formData.department) temp.department = "Department required";
        if (!formData.designation) temp.designation = "Designation required";

        setErrors(temp);

        return Object.keys(temp).length === 0;
    };

    const handleSubmit = async () => {

        if (!validate()) return;

        try {

            const payload = {
                email: formData.email,
                password: formData.password,
                department: formData.department,
                designation: formData.designation
            };

            await axiosInstance.post("/api/employees/create/", payload);

            showSnackbar("Employee created successfully", "success");

            setFormData({
                email: "",
                password: "",
                confirmPassword: "",
                department: "",
                designation: ""
            });

            setErrors({});

        } catch (err) {

            const apiError = err?.response?.data;

            let message = "Failed to create employee";

            if (apiError?.detail) {
                message = apiError.detail;
            }
            else if (apiError?.errors) {
                const firstField = Object.keys(apiError.errors)[0];
                message = apiError.errors[firstField][0];
            }
            else if (apiError?.message) {
                message = apiError.message;
            }

            showSnackbar(message, "error");
        }
    };

    return (
        <Box>

            <Typography variant="h4"
                fontWeight={500}
                sx={{ color: "#003465", mb: 1 }}
            >
                Add Employee
            </Typography>

            <Grid container spacing={3}>

                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <FormLabel>Email</FormLabel>

                        <AuthInput
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            onKeyDown={(e) => e.key === "Enter" && passwordRef.current.focus()}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <FormLabel>Password</FormLabel>

                        <AuthInput
                            type={showPassword ? "text" : "password"}
                            name="password"
                            inputRef={passwordRef}
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            onKeyDown={(e) => e.key === "Enter" && confirmPasswordRef.current.focus()}
                            error={!!errors.password}
                            helperText={errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <FormLabel>Confirm Password</FormLabel>

                        <AuthInput
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            inputRef={confirmPasswordRef}
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onKeyDown={(e) => e.key === "Enter" && departmentRef.current.focus()}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <FormLabel>Department</FormLabel>

                        <AuthInput
                            name="department"
                            inputRef={departmentRef}
                            placeholder="Enter department"
                            value={formData.department}
                            onChange={handleChange}
                            onKeyDown={(e) => e.key === "Enter" && designationRef.current.focus()}
                            error={!!errors.department}
                            helperText={errors.department}
                        />
                    </Stack>
                </Grid>

                <Grid item xs={12}>
                    <Stack spacing={1}>
                        <FormLabel>Designation</FormLabel>

                        <AuthInput
                            name="designation"
                            inputRef={designationRef}
                            placeholder="Enter designation"
                            value={formData.designation}
                            onChange={handleChange}
                            onKeyDown={(e) => e.key === "Enter" && setOpenConfirm(true)}
                            error={!!errors.designation}
                            helperText={errors.designation}
                        />
                    </Stack>
                </Grid>



            </Grid>

            <Grid item xs={12}>
                <Box textAlign="right">
                    <Button
                        variant="contained"
                        onClick={() => setOpenConfirm(true)}
                        disabled={Object.keys(errors).length > 0}
                        sx={{
                            backgroundColor: "#003465",
                            my: 1
                        }}
                    >
                        Create Employee
                    </Button>
                </Box>
            </Grid>

           

            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>

                <DialogTitle>
                    Confirm Employee Creation
                </DialogTitle>

                <DialogContent>
                    Are you sure you want to create this employee?
                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() => setOpenConfirm(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => {
                            setOpenConfirm(false);
                            handleSubmit();
                        }}
                        sx={{
                            backgroundColor: "#003465",
                            my: 1
                        }}
                    >
                        Confirm
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
}
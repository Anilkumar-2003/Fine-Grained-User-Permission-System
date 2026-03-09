import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Button,
  Divider,
  Avatar
} from "@mui/material";

import GroupsIcon from "@mui/icons-material/Groups";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../auth/AuthContext";

export default function Dashboard() {

  const avatarColors = [
    "#1976d2",
    "#2e7d32",
    "#9c27b0",
    "#ed6c02",
    "#d32f2f",
    "#0288d1",
    "#7b1fa2"
  ];

  const navigate = useNavigate();
  const { permissions } = useContext(AuthContext);

  const [summary, setSummary] = useState({
    total_employees: 0,
    total_permissions: 0,
    employees_with_permissions: 0,
    permission_distribution: []
  });

  const [recentEmployees, setRecentEmployees] = useState([]);

  const hasPermission = (perm) =>
    permissions?.some((p) => p.code === perm);

  const canViewSummary = hasPermission("ASSIGN_PERMISSION");

  const fetchSummary = async () => {
    try {
      const res = await axiosInstance.get("/api/summary/");
      setSummary(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRecentEmployees = async () => {
    try {
      const res = await axiosInstance.get(
        "/api/accounts_employee/getAll?page=0&size=4&sortBy=id&sortOrder=DESC"
      );
      setRecentEmployees(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSummary();
    if (canViewSummary) {
      fetchRecentEmployees();
    }
  }, [permissions]);

  const employeesWithoutPermissions =
    summary.total_employees - summary.employees_with_permissions;

  const pieData = [
    { name: "With Permissions", value: summary.employees_with_permissions },
    { name: "Without Permissions", value: employeesWithoutPermissions }
  ];

  const COLORS = ["#1976d2", "#00a2ff"];

  const permissionChartData =
    summary.permission_distribution?.map((item) => ({
      name: item.permission_name,
      users: item.users
    })) || [];

  const Card = ({ icon, title, value, subtitle }) => (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: 2
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">

        {icon}

        <Box>

          <Typography
            sx={{
              color: "#8c8c8c",
              fontSize: 14
            }}
          >
            {subtitle}
          </Typography>

          <Typography variant="h5" fontWeight={600}>
            {value}
          </Typography>

          <Typography
            sx={{
              fontWeight: 500,
              color: "#003465"
            }}
          >
            {title}
          </Typography>

        </Box>

      </Stack>
    </Paper>
  );

  return (

    <Box>

      <Typography
        variant="h4"
        mb={2}
        fontWeight={600}
        sx={{ color: "#003465" }}
      >
        Dashboard Overview
      </Typography>

      <Grid container spacing={2} mb={3}>

        <Grid size={{ xs: 12, md: canViewSummary ? 4 : 12 }}>
          <Card
            title="Total Employees"
            value={summary.total_employees}
            subtitle="All registered employees"
            icon={<GroupsIcon sx={{ fontSize: 40, color: "#1976d2" }} />}
          />
        </Grid>

        {canViewSummary && (
          <>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                icon={<AdminPanelSettingsIcon sx={{ fontSize: 40, color: "#9c27b0" }} />}
                title="Total Permissions"
                value={summary.total_permissions}
                subtitle="Permissions available in system"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                icon={<VerifiedUserIcon sx={{ fontSize: 40, color: "#2e7d32" }} />}
                title="Employees With Permissions"
                value={summary.employees_with_permissions}
                subtitle="Users assigned permissions"
              />
            </Grid>
          </>
        )}

      </Grid>

      {canViewSummary && (

        <Grid container spacing={2}>

          <Grid size={{ xs: 12, md: 4 }}>

            <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>

              <Typography
                variant="h6"
                mb={1.5}
                fontWeight={600}
                sx={{ color: "#003465" }}
              >
                Employee Permission Distribution
              </Typography>

              <Typography sx={{ color: "#8c8c8c", mb: 1.5 }}>
                Percentage of employees assigned permissions
              </Typography>


              <Box
                sx={{
                  height: 260,
                  width: "100%",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  p: 1
                }}
              >

                <ResponsiveContainer width="100%" aspect={1.5}>
                  <PieChart>

                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>

                </ResponsiveContainer>

              </Box>

            </Paper>

          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>

            <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>

              <Typography
                variant="h6"
                mb={1.5}
                fontWeight={600}
                sx={{ color: "#003465" }}
              >
                Permission Distribution
              </Typography>

              <Typography sx={{ color: "#8c8c8c", mb: 1.5 }}>
                Number of users assigned to each permission
              </Typography>

              <Box
                sx={{
                  height: 260,
                  width: "100%",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  p: 1
                }}
              >
                <ResponsiveContainer width="100%" aspect={1.3}>
                  <BarChart data={permissionChartData}>

                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />

                    <Bar
                      dataKey="users"
                      fill="#1976d2"
                      radius={[6, 6, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </Box>

            </Paper>

          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>

            <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>

              <Stack direction="row" justifyContent="space-between">

                <Typography
                  variant="h6"
                  fontWeight={500}
                  sx={{ color: "#003465" }}
                >
                  Recent Employees
                </Typography>

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PersonAddIcon />}
                  onClick={() => navigate("/add-employee")}
                  sx={{ textTransform: "none" }}
                >
                  Add
                </Button>

              </Stack>

              <Divider sx={{ my: 1.5 }} />

              <Stack spacing={1}>

                {recentEmployees.map((emp, index) => {

                  const initials = emp.username?.charAt(0)?.toUpperCase();
                  const color = avatarColors[index % avatarColors.length];

                  return (

                    <Paper
                      key={emp.emp_id}
                      sx={{
                        p: 1.5,
                        borderRadius: 5,
                        border: "1px solid #eeeeee",
                        boxShadow: "none"
                      }}
                    >

                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >

                        <Stack direction="row" spacing={2} alignItems="center">

                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              bgcolor: color,
                              fontSize: 14
                            }}
                          >
                            {initials}
                          </Avatar>

                          <Box>

                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: 14,
                                color: color
                              }}
                            >
                              {emp.username}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#8c8c8c"
                              }}
                            >
                              {emp.designation}
                            </Typography>

                          </Box>

                        </Stack>

                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "#9e9e9e"
                          }}
                        >
                          {new Date(emp.created_at).toLocaleDateString()}
                        </Typography>

                      </Stack>

                    </Paper>

                  );

                })}

              </Stack>

            </Paper>

          </Grid>

        </Grid>

      )}

    </Box>

  );

}
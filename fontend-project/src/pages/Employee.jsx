import {
    Box,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    TablePagination,
    Stack,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../auth/AuthContext";

export default function Employees() {

    const navigate = useNavigate();
    const { permissions } = useContext(AuthContext);

    const [employees, setEmployees] = useState([]);
    const [headers, setHeaders] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(0);

    const [search, setSearch] = useState("");

    const hasPermission = (perm) =>
        permissions?.some((p) => p.code === perm);

    const formatValue = (key, value) => {

        if (!value) return "";

        if (key === "created_at" || key === "updated_at") {
            return new Date(value).toLocaleString();
        }

        return value;
    };

    const fetchEmployees = async () => {

        try {

            const res = await axiosInstance.get(
                `/api/accounts_employee/getAll?page=${page}&size=${rowsPerPage}&sortBy=id&sortOrder=DESC`
            );

            const response = res.data;

            setHeaders(response.headers || []);
            setEmployees(response.data || []);
            setTotalRows(response.total_records || 0);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [page, rowsPerPage]);

    const handleRowClick = (emp) => {
        navigate(`/edit-employee/${emp.email}`);
    };

    const filteredEmployees = employees.filter((emp) =>
        emp.username?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>

            <Typography
                variant="h4"
                fontWeight={500}
                sx={{ color: "#003465", mb: 1 }}
            >
                Employee List
            </Typography>

            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                mb={2}
                justifyContent="space-between"
            >

                <TextField
                    label="Search Employee"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {hasPermission("CREATE_EMPLOYEE") && (
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#003465",
                            "&:hover": {
                                backgroundColor: "#00264d"
                            },
                            width:120
                        }}
                        onClick={() => navigate("/add-employee")}
                    >
                        Add
                    </Button>
                )}

            </Stack>

            {/* TABLE */}

            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 430,
                    overflowY: "auto",

                    "&::-webkit-scrollbar": {
                        display: "none"
                    },

                    msOverflowStyle: "none",
                    scrollbarWidth: "none"
                }}
            >

                <Table stickyHeader>

                    <TableHead>
                        <TableRow>

                            {headers.map((header) => (
                                <TableCell
                                    key={header.key}
                                    sx={{
                                        backgroundColor: "#f5f5f5",
                                        fontWeight: 600,
                                        color: "#003465"
                                    }}
                                >
                                    {header.label}
                                </TableCell>
                            ))}

                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {filteredEmployees.map((emp, index) => (
                            <TableRow
                                key={index}
                                hover
                                sx={{ cursor: "pointer" }}
                                onClick={() => handleRowClick(emp)}
                            >

                                {headers.map((header) => (
                                    <TableCell key={header.key}>
                                        {formatValue(header.key, emp[header.key])}
                                    </TableCell>
                                ))}

                            </TableRow>
                        ))}

                    </TableBody>

                </Table>

            </TableContainer>

            <TablePagination
                component="div"
                count={totalRows}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 20]}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
            />

        </Box>
    );
}
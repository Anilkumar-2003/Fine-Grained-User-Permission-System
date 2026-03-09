import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { permissions } = useContext(AuthContext);

  const hasPermission = (permCode) => {
    return permissions?.some((perm) => perm.code === permCode);
  };

  return (
    <Box
      sx={{
        width: "15rem",
        backgroundColor: "#1e293b",
        color: "white",
        overflowY: "auto"
      }}
    >
      <List>

        <ListItemButton onClick={() => navigate("/dashboard")}>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {hasPermission("VIEW_EMPLOYEE") && (
          <ListItemButton onClick={() => navigate("/employees")}>
            <ListItemText primary="Employees" />
          </ListItemButton>
        )}

        {hasPermission("ASSIGN_PERMISSION") && (
          <ListItemButton onClick={() => navigate("/assign-permissions")}>
            <ListItemText primary="Assign Permissions" />
          </ListItemButton>
        )}

      </List>
    </Box>
  );
}
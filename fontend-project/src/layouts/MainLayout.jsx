
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useContext } from "react";
import { PageLoaderContext } from "../context/PageLoaderContext";
import { Box, CircularProgress } from "@mui/material";

export default function MainLayout({ children }) {
  const { loading } = useContext(PageLoaderContext);
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <Header />

      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          overflow: "hidden"
        }}
      >
        <Sidebar />

        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: "2rem",
            position: "relative"
          }}
        >

          {loading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(255,255,255,0.6)",
                zIndex: 10
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {children}

        </Box>
      </Box>
    </Box>
  );
}
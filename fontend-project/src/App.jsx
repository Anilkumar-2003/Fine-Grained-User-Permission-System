import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthProvider } from "./auth/AuthContext";
import { CssBaseline } from "@mui/material";
import AppSnackbar from "./components/AppSnackbar";
import GlobalBackground from "./styles/GlobalBackground";

import { PageLoaderProvider } from "./context/PageLoaderContext";

import PageLoaderInitializer from "./context/PageLoaderInitializer";

export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline />

      <GlobalBackground>
        <PageLoaderProvider>
          <PageLoaderInitializer />
          <AuthProvider>
            <AppSnackbar>
              <AppRoutes />
            </AppSnackbar>
          </AuthProvider>
        </PageLoaderProvider>
      </GlobalBackground>

    </BrowserRouter>
  );
}
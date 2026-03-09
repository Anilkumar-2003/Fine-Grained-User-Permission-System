import { createContext, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {

  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>

      {children}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

    </LoaderContext.Provider>
  );
};
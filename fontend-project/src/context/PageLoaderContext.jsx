import { createContext, useState } from "react";

export const PageLoaderContext = createContext();

export const PageLoaderProvider = ({ children }) => {

  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <PageLoaderContext.Provider
      value={{ loading, showLoader, hideLoader }}
    >
      {children}
    </PageLoaderContext.Provider>
  );
};
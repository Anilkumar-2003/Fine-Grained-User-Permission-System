import { useContext, useEffect } from "react";
import { PageLoaderContext } from "./PageLoaderContext";
import { setPageLoader } from "../api/axiosInstance";

export default function PageLoaderInitializer() {

  const { showLoader, hideLoader } = useContext(PageLoaderContext);

  useEffect(() => {
    setPageLoader(showLoader, hideLoader);
  }, []);

  return null;
}
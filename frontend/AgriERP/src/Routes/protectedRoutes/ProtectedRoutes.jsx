import { Outlet, useFetcher, useLocation } from "react-router-dom";
import ErrorPage from "./ErrorPage.jsx";
import { isAuth } from "../../contextStore/ContextStore.jsx";
import { useEffect, useState } from "react";
import useUserAuthorization from "../../Authorization/UserAuthorization.jsx";

function ProtectedRoutes() {
  const location = useLocation();
  const [triggard, setTriggard] = useState(false);

  const isauth = isAuth();
  console.log("isauth:" + isauth);
  useEffect(() => {
    setTriggard(!triggard);
  }, [location]);

  return <>{isauth ? <Outlet /> : <ErrorPage />}</>;
}
export default ProtectedRoutes;

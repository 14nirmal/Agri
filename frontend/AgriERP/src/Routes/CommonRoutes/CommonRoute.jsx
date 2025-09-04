import { Navigate, Outlet, useNavigate } from "react-router";
import { isAuth } from "../../contextStore/contextstore";

function CommonRoute() {
  const isauth = isAuth();
  const navigate = useNavigate();
  if (isauth) {
    return navigate("/");
  }
  return <Outlet />;
}
export default CommonRoute;

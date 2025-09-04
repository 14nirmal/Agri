import { useContext, useEffect } from "react";
import { authContext } from "../contextStore/ContextStore.jsx";
import { useNavigate } from "react-router";

function useUserAuthorization() {
  const { setAuth } = useContext(authContext);
  const navigate = useNavigate();
  const isloginUser = async () => {
    const user = await fetch("/api/farmer/auth-status", {
      credentials: "include",
    });
    const data = await user.json();
    if (data.status == "active") {
      if (user.status == 200) {
        setAuth(data.auth);
        localStorage.setItem("first_name", data.user.first_name);
        localStorage.setItem("last_name", data.user.last_name);
      }
    } else {
      setAuth(false);
    }
  };

  const islogOutUser = async () => {
    const res = await fetch("/api/farmer/log-out", { credentials: "include" });
    const data = await res.json();
    if (res.status == 200) {
      setAuth(data.auth);
      localStorage.removeItem("first_name");
      localStorage.removeItem("last_name");
      navigate("/");
    }
  };
  return { isloginUser, islogOutUser };
}

export default useUserAuthorization;

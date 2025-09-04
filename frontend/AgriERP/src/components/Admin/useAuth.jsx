import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

function useAuth() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["fetchAuthStatus"],
    queryFn: async () => {
      const res = await fetch("/api/admin/auth");
      const data = await res.json();
      if (res.ok) {
        navigate("/admin/dashboard");
        return true;
      } else {
        navigate("/admin/login");
        return false;
      }
    },
  });
  return data;
}
export default useAuth;

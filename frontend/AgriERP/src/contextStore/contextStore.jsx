import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useState } from "react";

export const authContext = createContext({});

const ContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [farmData, setFarmData] = useState([]);
  useQuery({
    queryKey: ["FetchFarmData", isActive],
    queryFn: async () => {
      const res = await fetch("/api/farmer/farms", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        const data = await res.json();
      }
      setFarmData(data);
      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return (
    <authContext.Provider value={{ auth, setAuth, setFarmData, farmData }}>
      {children}
    </authContext.Provider>
  );
};

export const isActive = (farm_id) => {
  const { farmData } = useContext(authContext);

  const res = farmData?.farms?.find((farm) => farm._id == farm_id)?.isActive;
  // console.log(farmData.find((farm) => farm._id == farm_id));

  return res;
};

export const isAuth = () => {
  const { auth } = useContext(authContext);
  console.log(auth);
  return auth;
};

export default ContextProvider;

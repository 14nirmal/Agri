import { Outlet } from "react-router-dom";

import Footer from "./components/Home/Footer.jsx";
import "./App.css";
import Navbar from "./components/Home/Navbar.jsx";
import useUserAuthorization from "./Authorization/UserAuthorization.jsx";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

function App() {
  const { isloginUser } = useUserAuthorization();
  useEffect(() => {
    async function isvalidUser() {
      await isloginUser();
    }
    isvalidUser();
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <Outlet />
      <Footer></Footer>
      <ToastContainer />
    </>
  );
}

export default App;

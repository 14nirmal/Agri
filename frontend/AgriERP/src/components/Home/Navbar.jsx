import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";
import { isAuth } from "../../contextStore/contextstore";
import useUserAuthorization from "../../Authorization/UserAuthorization";
import { useTranslation } from "react-i18next";

function Navbar() {
  const [showDropDown, setDropdown] = useState(false);
  const { islogOutUser } = useUserAuthorization();
  const isauth = isAuth();
  const navigate = useNavigate();
  const logOut = async () => {
    await islogOutUser();
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openLoginForm = () => {
    navigate("/login");
    setDropdown(false);
  };
  const { t } = useTranslation();
  return (
    <>
      <nav className="bg-white z-30 top-0 shadow-md lg:shadow-gray-4  w-full h-[4.5rem] fixed flex lg:flex-row flex-col justify-center">
        <div className="w-full px-3 md:px-10 lg:px-4 xl:px-28 2xl:62px  flex justify-between items-center">
          <div className="image-container h-full w-36 flex items-center">
            <img
              alt="no"
              //give always absolute path not a relative
              srcSet="/src/assets/logo.png"
              className="w-full"
              onLoad={() => {
                console.log("image loaded");
              }}
            />
          </div>
          <div className="menus hidden lg:flex lg:gap-6 xl:gap-8 justify-between items-center">
            <NavLink
              to="/"
              className={({ isActive }) => {
                {
                  return `${
                    isActive ? "text-[#6B8E23] " : " text-gray-600"
                  } font-semibold text-nowrap hover:border-b-2 border-b-green-300 animate-out"); `;
                }
              }}
              onClick={scrollToTop()}
              // className=
            >
              {/* Home */}
              {t("navmenu-1")}
            </NavLink>
            <NavLink
              to="/farms"
              className={({ isActive }) => {
                {
                  return `${
                    isActive ? "text-[#6B8E23] " : " text-gray-600 "
                  }font-semibold text-nowrap hover:border-b-2 border-b-green-300 animate-out"); `;
                }
              }}
              onClick={scrollToTop()}
            >
              {t("navmenu-2")}
            </NavLink>
            <NavLink
              to="/financials"
              className={({ isActive }) => {
                {
                  return `${
                    isActive ? "text-[#6B8E23] " : " text-gray-600"
                  } font-semibold text-nowrap hover:border-b-2 border-b-green-300 animate-out"); `;
                }
              }}
              onClick={scrollToTop()}
            >
              {t("navmenu-3")}
            </NavLink>
            <NavLink
              to="/inventory"
              className={({ isActive }) => {
                {
                  return `${
                    isActive ? "text-[#6B8E23] " : "text-gray-600"
                  }  font-semibold text-nowrap hover:border-b-2 border-b-green-300 animate-out"); `;
                }
              }}
              onClick={scrollToTop()}
            >
              {t("navmenu-4")}
            </NavLink>
            <NavLink
              to="/wheather"
              className={({ isActive }) => {
                {
                  return `${
                    isActive ? "text-[#6B8E23] " : "text-gray-600"
                  }  font-semibold text-nowrap hover:border-b-2 border-b-green-300 animate-out"); `;
                }
              }}
              onClick={scrollToTop()}
            >
              {t("navmenu-5")}
            </NavLink>
            <NavLink
              to="/marketPrice"
              className={({ isActive }) => {
                {
                  return `${
                    isActive ? "text-[#6B8E23] " : "text-gray-600"
                  }  font-semibold text-nowrap hover:border-b-2 border-b-green-300 animate-out"); `;
                }
              }}
              onClick={scrollToTop()}
            >
              {t("navmenu-6")}
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => {
                {
                  return `${
                    isActive ? "text-[#6B8E23] " : "text-gray-600"
                  }  font-semibold text-nowrap hover:border-b-2 border-b-green-300 animate-out"); `;
                }
              }}
              onClick={scrollToTop()}
            >
              {t("navmenu-7")}
            </NavLink>
          </div>
          {console.log("login " + isauth)}
          {!isauth ? (
            <button
              className="bg-green-700 px-4 py-2 text-md font-semibold text-white rounded-md hidden lg:block"
              onClick={openLoginForm}
            >
              {t("login")}
            </button>
          ) : (
            <button
              className="bg-green-700 px-4 py-2 text-md font-semibold text-white rounded-md hidden lg:block"
              onClick={logOut}
            >
              {t("logout")}
            </button>
          )}

          <div className="lg:hidden">
            {!showDropDown && (
              <FaBars
                className="  text-xl"
                onClick={() => {
                  setDropdown(true);
                  // scrollToTop();
                }}
              />
            )}
          </div>
        </div>
        {/* mobile menues */}
        {showDropDown && (
          <div className="fixed inset-0 lg:hidden">
            <div className="rounded-sm bg-white menus lg:hidden flex flex-col px-28 py-6 items-center gap-6">
              <div className="fixed right-2 block top-2">
                <RxCross2
                  className="text-xl"
                  onClick={() => {
                    setDropdown(false);
                    //scrollToTop();
                  }}
                />
              </div>
              <NavLink
                to="/"
                className="text-gray-600 font-semibold text-nowrap mt-4"
                onClick={() => {
                  setDropdown(false);
                  scrollToTop();
                }}
              >
                Home
              </NavLink>
              <NavLink
                to="/farms"
                className="text-gray-600 font-semibold text-nowrap"
                onClick={() => {
                  setDropdown(false);
                  scrollToTop();
                }}
              >
                Farm Management
              </NavLink>
              <NavLink
                to="/financials"
                className="text-gray-600 font-semibold text-nowrap"
                onClick={() => {
                  setDropdown(false);
                  scrollToTop();
                }}
              >
                Financials
              </NavLink>
              <NavLink
                to="/inventory"
                className="text-gray-600 font-semibold text-nowrap"
                onClick={() => {
                  setDropdown(false);
                  scrollToTop();
                }}
              >
                Inventory
              </NavLink>
              <NavLink
                to="/wheather"
                className="text-gray-600 font-semibold text-nowrap"
                onClick={() => {
                  setDropdown(false);
                  scrollToTop();
                }}
              >
                Wheather
              </NavLink>
              <NavLink
                to="/marketPrice"
                className="text-gray-600 font-semibold text-nowrap"
                onClick={() => {
                  setDropdown(false);
                  scrollToTop();
                }}
              >
                Market Price
              </NavLink>
              <NavLink
                to={"/dashboard"}
                className="text-gray-600 font-semibold text-nowrap"
                onClick={() => {
                  setDropdown(false);
                  scrollToTop();
                }}
              >
                Dashboard
              </NavLink>
              {!isauth ? (
                <button
                  className="bg-green-700 px-4 py-2 text-md font-semibold text-white rounded-md lg:hidden"
                  onClick={openLoginForm}
                >
                  Login
                </button>
              ) : (
                <button
                  className="bg-green-700 px-4 py-2 text-md font-semibold text-white rounded-md lg:hidden"
                  onClick={logOut}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
export default Navbar;

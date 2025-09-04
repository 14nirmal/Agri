import { useNavigate } from "react-router";
import { isAuth } from "../../contextStore/ContextStore.jsx";
import { RiGlobalLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import i18n from "../../Translations/i18n.js";
import { useEffect } from "react";

function Herosection() {
  const isauth = isAuth();
  const navigate = useNavigate();
  const handelOnClick = () => {
    !isauth ? navigate("/login") : navigate("/farms");
  };

  const { t, i18n } = useTranslation();

  const changeLaguage = () => {
    const newLang = i18n.resolvedLanguage === "en" ? "gu" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <>
      <div className="hero-section mt-16 w-full px-3 md:px-10 lg:px-4 xl:px-28 2xl:62px flex justify-between bg-gradient-to-br from-[#a8e6cf] to-[#dcedc1] min-h-80 lg:min-h-[28rem] lg:pt-0 lg:pb-0 pt-9 pb-9 relative">
        <div className="absolute  top-3 right-0 lg:px-4 xl:px-28 2xl:62px ">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 border border-green-800 flex gap-1 items-center mr-1"
            onClick={() => changeLaguage()}
          >
            <RiGlobalLine />
            {i18n.resolvedLanguage === "en" ? "ગુજરાતી" : "English"}
          </button>
        </div>
        <div className="hero-section-content flex flex-wrap items-center justify-center gap-8 sm:gap-2 md:gap-8 lg:gap-20">
          <div className="left-side flex flex-col sm:flex-1 gap-5 lg:gap-6">
            <h1 className="font-bold text-2xl lg:text-3xl xl:text-5xl">
              {/* Simplify Farm Management For Every Farmer */}
              {t("hero_title")}
            </h1>
            <p className="text-sm lg:text-md xl:text-lg">
              {/* Streamline your farming operations with AgriERP, the all-in-one
              solution for managing crops, livestock, and resources. Increase
              efficiency and productivity with real-time data and smart
              analytics. */}
              {t("hero_description")}
            </p>
            <div>
              <button
                className="bg-green-700 text-md px-4 py-2 rounded-md text-white font-semibold"
                onClick={handelOnClick}
              >
                {/* Get Started */}
                {t("get_started")}
              </button>
            </div>
          </div>
          <div className="sm:flex-1">
            <img
              src="./src/assets/hero.png"
              alt=""
              srcSet=""
              className="rounded-md opacity-95 border-none "
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Herosection;

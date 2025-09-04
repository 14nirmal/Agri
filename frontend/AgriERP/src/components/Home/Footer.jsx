import { FaPhone } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import {
  FaFacebookSquare,
  FaWhatsappSquare,
  FaYoutubeSquare,
} from "react-icons/fa";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <>
      <div className="relative pt-16 w-full px-3 md:px-10 lg:px-4 xl:px-28 2xl:62px bg-[#b58865]">
        <svg
          className="absolute -top-1 sm:-top-2 lg:-top-3 left-0 w-full"
          viewBox="0 0 1200 15"
          preserveAspectRatio="none"
        >
          <path
            d="M0,8 C30,12 60,8 100,10 C130,12 160,6 200,8 C230,10 270,5 300,10 C330,8 370,6 400,9 C430,10 470,8 500,10 C530,12 570,6 600,8 C630,10 670,7 700,9 C730,11 770,5 800,8 C830,10 870,7 900,9 C930,12 970,6 1000,8 C1030,10 1070,5 1100,9 C1130,11 1170,6 1200,10 L1200,25 L0,25 Z"
            className="fill-[#b58865]"
          />
        </svg>
        <div className="footer-main flex flex-wrap gap-10 lg:gap-4">
          <div className="footer-links flex flex-col gap-1 flex-1 min-w-[280px]">
            <h1 className="font-bold text-[#4e3629] text-xl">
              {/* Quick Links */}
              {t("quick_links")}
            </h1>
            <NavLink
              to="/"
              className="text-[#f8f1e4] font-semibold text-nowrap mt-2"
            >
              {/* Home */}
              {t("home")}
            </NavLink>
            <NavLink
              to="/farms"
              className="text-[#f8f1e4] font-semibold text-nowrap"
            >
              {/* Farm Management */}
              {t("farm_management")}
            </NavLink>
            <NavLink
              to="/financials"
              className="text-[#f8f1e4] font-semibold text-nowrap"
            >
              {/* Financials */}
              {t("financials")}
            </NavLink>
            <NavLink
              to="/inventory"
              className="text-[#f8f1e4] font-semibold text-nowrap"
            >
              {/* Inventory */}
              {t("inventory")}
            </NavLink>
            <NavLink
              to="/wheather"
              className="text-[#f8f1e4] font-semibold text-nowrap"
            >
              {/* Weather */}
              {t("weather")}
            </NavLink>
            <NavLink
              to="/marketPrice"
              className="text-[#f8f1e4] font-semibold text-nowrap"
            >
              {/* Market Price */}
              {t("market_price")}
            </NavLink>
            <NavLink to="" className="text-[#f8f1e4] font-semibold text-nowrap">
              {/* About us */}
              {t("about_us")}
            </NavLink>
          </div>

          <div className="footer-contact-us flex flex-col gap-1 flex-1 min-w-[280px]">
            <h1 className="font-bold text-[#4e3629] text-xl">
              {/* Contact us */}
              {t("contact_us")}
            </h1>
            <a
              className="text-[#FDF5E6] font-semibold text-nowrap mt-2"
              href="tel:+919327849299"
            >
              <FaPhone className="inline-block text-lg" /> &nbsp; +91 9327849299
            </a>
            <a
              className="text-[#FDF5E6] font-semibold text-nowrap mt-2"
              href="mailto:agrierp9999@gmail.com"
            >
              <IoMail className="inline-block text-lg" /> &nbsp;
              agrierp9999@gmail.com
            </a>
          </div>

          <div className="footer-followUs flex flex-col gap-1 flex-1 min-w-[280px]">
            <h1 className="font-bold text-[#4e3629] text-xl">
              {/* Follow Us */}
              {t("follow_us")}
            </h1>
            <div className="flex gap-3 mt-3">
              <FaFacebookSquare className="text-3xl text-[#FDF5E6] hover:cursor-pointer" />
              <FaWhatsappSquare className="text-3xl text-[#FDF5E6] hover:cursor-pointer" />
              <FaYoutubeSquare className="text-3xl text-[#FDF5E6] hover:cursor-pointer" />
            </div>
          </div>

          <div className="footer-followon flex flex-col gap-1 flex-1 min-w-[280px]">
            <h1 className="font-bold text-[#4e3629] text-xl">
              {/* About AgriERP */}
              {t("about_agrierp")}
            </h1>
            <p className="text-[#FDF5E6] font-semibold  mt-2">
              {/* AgriERP is a comprehensive platform... */}
              {t("about_text")}
            </p>
          </div>
        </div>

        <div className="w-full h-full flex items-center justify-center py-3">
          <p className="text-center mt-10 mb-1 text-white">
            {/* © 2025 AgriERP. All rights reserved. */}
            {t("copyright")}
          </p>
        </div>
      </div>
    </>
  );
}

export default Footer;

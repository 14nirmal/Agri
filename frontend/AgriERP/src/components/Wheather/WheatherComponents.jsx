import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { FaSearchLocation } from "react-icons/fa";
import Weatherc from "./Wheatherc";
import { IoIosSearch } from "react-icons/io";

function WheatherComponents() {
  return (
    <>
      <div className="pt-28 pb-12 px-1 md:px-10 lg:px-4 xl:px-28 2xl:62px w-full h-full bg-green-50 ">
        <Weatherc />
      </div>
    </>
  );
}

export default WheatherComponents;

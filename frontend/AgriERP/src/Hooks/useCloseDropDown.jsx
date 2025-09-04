import { useEffect, useRef } from "react";

function useCloseDropDown({ dropdownRef, setOpenMenu }) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return <></>;
}
export default useCloseDropDown;

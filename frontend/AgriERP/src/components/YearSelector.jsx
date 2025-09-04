import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const YearSelector = ({ onSelectYear }) => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 6;
  const years = Array.from({ length: 7 }, (_, i) => startYear + i);

  const [selectedYears, setSelectedYears] = useState([currentYear]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, []);

  const handleYearClick = (year) => {
    setSelectedYears((prev) => {
      const newSelection = prev.includes(year)
        ? prev.filter((y) => y !== year) // Deselect if already selected
        : [...prev, year]; // Select if not already selected

      if (onSelectYear) onSelectYear(newSelection);
      return newSelection;
    });
  };

  return (
    <div
      ref={containerRef}
      className="flex overflow-x-auto space-x-2 p-4 border rounded-xl bg-gray-100"
    >
      {years.map((year) => (
        <motion.div key={year} whileTap={{ scale: 0.9 }}>
          <button
            onClick={() => handleYearClick(year)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 border ${
              selectedYears.includes(year)
                ? "bg-blue-600 text-white"
                : "bg-white text-black"
            }`}
          >
            {year}
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default YearSelector;

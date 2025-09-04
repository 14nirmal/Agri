import Footer from "./Home/Footer";
import Navbar from "./Home/Navbar";
import Herosection from "./Home/Herosection";
import Features from "./Home/Features";
import FarmerReview from "./Home/FarmerReview";

const AgriPlatform = () => {
  return (
    <>
      {/* hero section */}
      <Herosection></Herosection>
      {/* key features */}
      <Features></Features>
      {/* farmer review */}
      <FarmerReview></FarmerReview>
      {/*footer*/}
    </>
  );
};
export default AgriPlatform;

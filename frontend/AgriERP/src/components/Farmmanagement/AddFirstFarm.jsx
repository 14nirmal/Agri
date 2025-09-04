import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router";
function AddFirstFarm() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex min-h-dvh justify-center items-center">
        <div className="bg-white text-black max-w-[30rem] flex flex-col  items-center p-5 gap-2 rounded-lg shadow-md shadow-gray-400 border-2  text-center ">
          <div className="err-icon flex h-12">
            <img src="./src/assets/logo.png" alt="" className="h-full" />
          </div>
          <h1 className="text-2xl font-bold">
            Welcome to Your Farm Management Dashboard
          </h1>
          <p className="text-gray-600">
            You haven't added any farms yet. Let's get started by adding your
            first farm!
          </p>
          <button
            type="submit"
            className="bg-green-700 mt-2 text-white px-4 py-2 rounded-md font-semibold flex items-center"
            onClick={() => {
              navigate("/farms/addfarm");
            }}
          >
            <FaPlus className="inline-block text-2xl mr-2" />
            Add First Farm
          </button>
        </div>
      </div>
    </>
  );
}
export default AddFirstFarm;

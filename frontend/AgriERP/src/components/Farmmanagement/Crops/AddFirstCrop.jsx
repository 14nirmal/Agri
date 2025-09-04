import { FaPlus } from "react-icons/fa6";
import { CgAddR } from "react-icons/cg";
import { useLocation, useNavigate, useParams } from "react-router";
function AddFirstCrop() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const farmId = queryParams.get("id");
  const { f_id } = useParams();

  return (
    <>
      <div className="min-h-dvh flex justify-center items-center px-2 -mt-20">
        <div className="  text-black max-w-[30rem] flex flex-col items-center p-5 gap-2 rounded-lg shadow-md shadow-gray-400 border-4 border-spacing-2 border-dotted text-center ">
          <div className="err-icon flex h-12">
            <img src="/logo.png" alt="" className="h-full" />
          </div>

          <p className="text-gray-600">
            You haven't added any Crops yet. Let's get started by adding your
            first Crop in your farm!
          </p>
          <button
            type="submit"
            className="bg-green-700 mt-2 text-white px-4 py-2 rounded-md font-semibold flex items-center"
            onClick={() => {
              navigate(`/farms/crops/addcrop?id=${farmId || f_id}`);
            }}
          >
            <FaPlus className="inline-block text-2xl mr-2" />
            Add First Crop
          </button>
        </div>
      </div>
    </>
  );
}
export default AddFirstCrop;

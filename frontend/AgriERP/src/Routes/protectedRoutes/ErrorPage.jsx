import { BiError } from "react-icons/bi";
import { CgLogIn } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
function ErrorPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className=" min-h-[40rem] lg:min-h-[44rem]  px-3 md:px-10 lg:px-4 xl:px-28 2xl:62px flex w-full  justify-center items-center bg-white">
        <div className="bg-white text-black max-w-[30rem] flex flex-col items-center p-5 gap-2 rounded-lg shadow-md border-2  text-center">
          <div className="err-icon ">
            <BiError className="text-7xl text-red-600"></BiError>
          </div>
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-gray-600">
            You do not have permission to access this page. Please log in with
            appropriate credentials.
          </p>
          <button
            type="submit"
            className="bg-green-700 mt-2 text-white px-4 py-2 rounded-md font-semibold flex items-center"
            onClick={() => {
              navigate("/login");
            }}
          >
            <CgLogIn className="inline-block text-2xl mr-2" />
            Go To Login
          </button>
        </div>
      </div>
    </>
  );
}
export default ErrorPage;

import { VscEmptyWindow } from "react-icons/vsc";
function TransactionNotFound() {
  return (
    <>
      <div className="flex justify-center items-center px-2 h-full ">
        <div className="  text-black max-w-[30rem] flex flex-col items-center p-5 gap-2 rounded-lg shadow-md bg-red-50 shadow-gray-400  text-center ">
          <div className="err-icon flex h-12">
            <VscEmptyWindow className="text-5xl" />
          </div>
          <p className="text-gray-600 font-semibold">No Transaction Found</p>
        </div>
      </div>
    </>
  );
}
export default TransactionNotFound;

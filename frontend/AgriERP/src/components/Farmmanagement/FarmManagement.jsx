import { useEffect, useState } from "react";
import AddFirstFarm from "./AddFirstFarm.jsx";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../Store/store.js";
import { fetchfarmdata } from "../../Store/slices/farmmanagemnetSlice.jsx";
import { FiPlus } from "react-icons/fi";
import Farms from "./Farms.jsx";
import Spinner from "./Spinner.jsx";
function FarmManagement() {
  const [newUser, setNewUser] = useState(false);
  const { err, data, isLoading } = useSelector((store) => store.FarmData);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchfarmdata());
  }, []);

  return (
    <>
      <div className="w-full min-h-dvh">
        {/* {err && data.status == 404 && <AddFirstFarm />} */}
        {data && <Farms />}
      </div>
    </>
  );
}
export default FarmManagement;

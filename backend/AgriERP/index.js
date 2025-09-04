const express = require("express");
const app = express();
const SignupRoute = require("./Routes/signup");
const LoginRoutes = require("./Routes/login");
const { ObjectId } = require("mongodb");
const {
  viewFarm,
  Addfarm,
  EditFarm,
  DisableFarm,
} = require("./Routes/FarmManagementRoutes/farmData");
const {
  viewCrop,
  AddCrop,
  viewIndividualCrop,
  CompleteCrop,
  DeleteCrop,
} = require("./Routes/FarmManagementRoutes/cropData");
const {
  addExpense,
  addIncome,
} = require("./Routes/FinanceManagementRoutes/expenseRoutes");
const cookieparser = require("cookie-parser");
const {
  addActivity,
  viewActivity,
  updateActivityStatus,
  deleteActivity,
} = require("./Routes/FarmManagementRoutes/activityData");
const cors = require("cors");
const isAuthorized = require("./Routes/Auth");
const {
  inventoriesRouter,
  PostInventories,
  inventoryTransaction,
  transactionRoute,
  deleteInventory,
} = require("./Routes/InventoryRoute/InventoryRoute");
const dashBoardRoute = require("./Routes/Dashboard/Dashboard");
const {
  AdminLogin,
  dashboardRoute,
  Adminlogout,
  adminAuth,
  farmerData,
  getFarmerBriefDetail,
} = require("./Routes/Admin/login");
const verifyLogin = require("./Routes/Admin/verificaion");
const signupModel = require("./DB/SignupSchema");
const {
  FeedBackRoute,
  showFeedBackRotes,
} = require("./Routes/FeedBack/feedBackRoute");
const sendSms = require("./sms/sendSms");

require("dotenv").config();

app.use(cookieparser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);

app.get("/api/farmer/auth-status", isAuthorized, async (req, res) => {
  const { userInfo } = req.body;
  const farmer_data = await signupModel.findById(new ObjectId(req.body.id));
  res
    .status(200)
    .send({ user: { ...userInfo }, auth: true, status: farmer_data.status });
});

app.get("/api/farmer/log-out", isAuthorized, (req, res) => {
  res.clearCookie("Token", { httpOnly: true });
  res.clearCookie("F_id", { httpOnly: true });
  return res
    .status(200)
    .json({ msg: "user Logout Successfully!", auth: false });
});

app.use("/", SignupRoute);
app.use("/", LoginRoutes);
app.use("/", Addfarm);
app.use("/", viewFarm);
app.use("/", AddCrop);
app.use("/", viewCrop);
app.use("/", addActivity);
app.use("/", viewActivity);
app.use("/", addExpense);
app.use("/", updateActivityStatus);
app.use("/", deleteActivity);
app.use("/", addIncome);
app.use("/", inventoriesRouter);
app.use("/", PostInventories);
app.use("/", inventoryTransaction);
app.use("/", transactionRoute);
app.use("/", deleteInventory);
app.use("/", viewIndividualCrop);
app.use("/", CompleteCrop);
app.use("/", DeleteCrop);
app.use("/", EditFarm);
app.use("/", DisableFarm);
app.use("/", dashBoardRoute);

//admin
app.use("/", AdminLogin);
app.use("/", verifyLogin);
app.use("/", dashboardRoute);
app.use("/", Adminlogout);
app.use("/", adminAuth);
app.use("/", farmerData);
app.use("/", getFarmerBriefDetail);
//it is mandetory to create a seperate route for the images when my client call this routes it serve the images . and frontend find a releted images and show it using a specific path
app.use("/uploads", express.static("uploads"));

//feedback
app.use("/", FeedBackRoute);
app.use("/", showFeedBackRotes);
app.use("/", sendSms);

app.listen(process.env.PORT || 1000, () => {
  console.log(`app started on ${process.env.PORT}`);
});

const express = require("express");
const route = express.Router();
const isAuthorized = require("../Auth");
const farmSchema = require("../../DB/farmSchema");
const financialModel = require("../../DB/financialsSchema");
const upload = require("../../Multer");
const Routes = require("twilio/lib/rest/Routes");
const fs = require("fs");
const { ObjectId, Timestamp } = require("mongodb");
const { default: mongoose } = require("mongoose");
const farmModel = require("../../DB/farmSchema");

route.use(express.json());

const deleteUnusedImage = (path) => {
  fs.unlinkSync(path);
};

const addExpense = route.post(
  "/api/farmer/farm/:farm_id/addExpense/:crop_id",
  isAuthorized,
  upload.single("image_url"),
  async (req, res) => {
    try {
      const { F_id } = req.cookies;
      let financial_year = new Date().getFullYear();
      const { farm_id, crop_id } = req.params;

      let financialRecord = await financialModel.findOne({
        farm_id,
        financial_year,
      });

      if (!financialRecord) {
        const isFarmExist = await farmSchema.findById(farm_id);
        if (!isFarmExist) {
          req.file ? deleteUnusedImage(req.file.path) : null;
          return res.status(404).json({ msg: "Farm not found!" });
        }

        financialRecord = new financialModel({
          farm_id,
          financial_year,
          farmer_id: F_id,
        });
      }

      //filter the expense details from transaction details
      const {
        expense_type,
        transaction_date,
        transaction_type,
        note,
        image_url,
        amount,
        crop_name,
      } = req.body;
      const expensesDemo = {
        expense_type,
        transaction_date,
        crop_id: new ObjectId(crop_id),
        note,
        image_url,
        transaction_type,
        amount,
        crop_name,
        Timestamp: new Date(),
      };
      console.log(expensesDemo);

      if (req.file) {
        expensesDemo.image_url = req.file.path;
      }

      financialRecord.expenses.push(expensesDemo);

      try {
        await financialRecord.save();
        return res.status(200).json({ msg: "Expense added successfully!" });
      } catch (validationError) {
        req.file ? deleteUnusedImage(req.file.path) : null;
        return res.status(400).json({
          msg: "Please fill all required fields!",
          err: validationError.message,
        });
      }
    } catch (e) {
      console.error(e.message);
      req.file ? deleteUnusedImage(req.file.path) : null;
      res.status(500).json({ msg: "Internal server error!" });
    }
  }
);

const addIncome = route.post(
  "/api/farmer/farm/:farm_id/addIncome/:crop_id",
  isAuthorized,
  upload.single("image_url"),
  async (req, res) => {
    try {
      const { farm_id, crop_id } = req.params;

      let financial_year = new Date().getFullYear();

      let financialRecord = await financialModel.findOne({
        farm_id,
        financial_year,
      });

      if (!financialRecord) {
        const isFarmExist = await farmSchema.findById(farm_id);

        if (!isFarmExist) {
          return res.status(404).json({ msg: "Farm not found!" });
        }

        financialRecord = new financialModel({
          farm_id,
          financial_year,
        });
      }

      //when you pass the json data with the body you need to parse it.
      //it convert json to normal object
      //only i need to translate income because it is a json string and the farm id is normal filed which is automatically translated by urlencoded and make it usable for server

      req.body.crop_id = new ObjectId(crop_id);
      let parsedIncome = {};
      //filter data releted sell income
      if (req.body?.income_type == "sell") {
        const {
          income_type,
          crop_name,
          price,
          price_unit,
          weight,
          weight_unit,
          amount,
          trader_name,
          image_url,
          transaction_date,
          transaction_type,
          note,
        } = req.body;
        parsedIncome = {
          crop_id,
          income_type,
          crop_name,
          price,
          price_unit,
          weight,
          weight_unit,
          amount,
          trader_name,
          image_url,
          transaction_date,
          transaction_type,
          note,
          Timestamp: new Date(),
        };
      }
      //filter data releted subsidy
      if (req.body?.income_type == "subsidy") {
        const {
          income_type,
          scheme_name,
          transaction_date,
          transaction_type,
          note,
          image_url,
          amount,
          crop_name,
        } = req.body;
        parsedIncome = {
          crop_id,
          income_type,
          scheme_name,
          transaction_type,
          transaction_date,
          note,
          image_url,
          amount,
          crop_name,
          Timestamp: new Date(),
        };
      }
      if (req.file) {
        parsedIncome.image_url = req.file.path;
      }

      financialRecord.incomes.push(parsedIncome);
      try {
        await financialRecord.save();
        return res.status(200).json({ msg: "income added successfully!" });
      } catch (validationError) {
        req.file ? deleteUnusedImage(req.file.path) : null;
        return res.status(400).json({
          msg: "Please fill all required fields!",
          err: validationError.message,
        });
      }
    } catch (e) {
      console.log("error:" + e.message);
      req.file ? deleteUnusedImage(req.file.path) : null;
      res.status(500).json({ msg: "Internal server error!" });
    }
  }
);

const updateTotalIncomeAndExpense = async (farm_id) => {
  //update manually total income and total expensess
  const data = await financialModel.find({ farm_id: farm_id });
  console.log(data);
  const total_income = data[0].incomes?.reduce(
    (sum, income) => sum + income.amount,
    0
  );
  const total_expense = data[0].expenses?.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const updateTotalIncomeAndExpense = await financialModel.updateMany(
    {
      farm_id: new ObjectId(farm_id),
    },
    {
      $set: {
        total_income: Number(total_income),
        total_expense: Number(total_expense),
      },
    }
  );
  if (updateTotalIncomeAndExpense.acknowledged) {
    return true;
  }
};

const deleteTransaction = route.delete(
  "/api/farmer/farm/:farm_id/crop/transaction/:id/:type/delete",
  isAuthorized,
  async (req, res) => {
    const { id, type } = req.params;
    console.log(req.params.farm_id);
    //delete the transactions
    if (type == "expense") {
      const response = await financialModel.updateOne(
        { "expenses._id": new ObjectId(id) },
        { $pull: { expenses: { _id: new ObjectId(id) } } }
      );
      await updateTotalIncomeAndExpense(new ObjectId(req.params.farm_id));
      return response.modifiedCount == 1
        ? res.status(200).json({ msg: "Transaction Deleted Successfully!" })
        : res.status(404).json({ msg: "Transaction Not Found!" });
    }
    if (type == "income") {
      const response = await financialModel.updateOne(
        { "incomes._id": new ObjectId(id) },
        { $pull: { incomes: { _id: new ObjectId(id) } } }
      );
      await updateTotalIncomeAndExpense(new ObjectId(req.params.farm_id));
      return response.modifiedCount == 1
        ? res.status(200).json({ msg: "Transaction Deleted Successfully!" })
        : res.status(404).json({ msg: "Transaction Not Found!" });
    }

    res.status(500).json({ msg: "Internal server error" });
  }
);

const viewfinancials = route.get(
  "/api/farmer/farm/viewfinancials",
  isAuthorized,
  async (req, res) => {
    try {
      //data shows by farm id
      if (req.query.farm_id) {
        try {
          let farm_id = String(req.query.farm_id);

          farm_id = new ObjectId(farm_id);

          const data = await farmModel.findOne({ _id: farm_id });

          const cropdata = await Promise.all(
            data.crops.map(async (crop) => {
              const expenses = await financialModel.aggregate([
                { $unwind: "$expenses" },
                {
                  $match: {
                    "expenses.crop_id": crop._id,
                  },
                },
                { $project: { expenses: 1, _id: 0 } },
              ]);
              const incomes = await financialModel.aggregate([
                { $unwind: "$incomes" },
                {
                  $match: {
                    "incomes.crop_id": crop._id,
                  },
                },

                { $project: { incomes: 1, _id: 0 } },
              ]);

              const total_expense = expenses.reduce(
                (sum, e) => sum + e.expenses.amount,
                0
              );

              const total_income = incomes.reduce(
                (sum, e) => sum + e.incomes.amount,
                0
              );
              return {
                crop_name: crop.crop_name,
                crop_id: crop._id,
                expenses,
                incomes,
                total_income,
                total_expense,
              };
            })
          );

          return res.status(200).send({ cropdata, farm_name: data?.farm_name });
        } catch (e) {
          return res
            .status(404)
            .json({ msg: "No Data Found!", err: e.message });
        }
      }

      //data shows by crop id
      if (req.query.crop_id) {
        let crop_id = String(req.query.crop_id);
        try {
          crop_id = new ObjectId(crop_id);

          const expenses = await financialModel.aggregate([
            { $unwind: "$expenses" },
            {
              $match: {
                "expenses.crop_id": crop_id,
              },
            },

            { $project: { expenses: 1, _id: 0, cropdata: 1 } },
          ]);
          const incomes = await financialModel.aggregate([
            { $unwind: "$incomes" },
            {
              $match: {
                "incomes.crop_id": crop_id,
              },
            },
            { $project: { incomes: 1, _id: 0 } },
          ]);
          const total_expense = expenses.reduce(
            (sum, e) => sum + e.expenses.amount,
            0
          );
          const total_income = incomes.reduce(
            (sum, e) => sum + e.incomes.amount,
            0
          );

          //flattern array Clean response format
          const filteredExpenses = expenses.map((e) => {
            return e.expenses;
          });
          const filteredIncomes = incomes.map((e) => {
            return e.incomes;
          });

          return res.status(200).send({
            crop_id,
            expenses: filteredExpenses,
            incomes: filteredIncomes,
            total_expense,
            total_income,
          });
        } catch (e) {
          return res.status(404).json({ msg: "no data found!" });
        }
      }
      // let { id } = req.params;
      // console.log(req.body.id);

      // id = new ObjectId(id);
      // const changes = await financialModel.findOne({ farm_id: id });
      // if (changes) {
      //   await changes.save();
      //   //to update income and expense during the sending data to client
      // }

      //data shows based on farmer id
      const data = await financialModel.aggregate([
        {
          $match: {
            farmer_id: req.body.id,
            financial_year: req.query.financial_year || "2025",
          },
        },
        {
          $lookup: {
            from: "farms",
            localField: "farm_id",
            foreignField: "_id",
            as: "farm",
          },
        },
        {
          $project: {
            "farm.farm_name": 1,
            "farm.crops": 1,
            total_income: 1,
            total_expense: 1,
            financial_year: 1,
            farm_id: 1,
          },
        },
      ]);

      return res.status(200).send({ farmer_id: req.body.id, data });
    } catch (e) {
      return res
        .status(500)
        .json({ msg: "Internal server error!", err: e.message });
    }
  }
);

route.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ msg: err.message });
  }
  next();
});

const convertor = (price, punit, weight, wunit) => {
  let totalamount = 0;
  let pricebyKg = 0;
  let weightBykg = 0;
  const units = {
    kg: 1,
    man: 20,
    quintal: 100,
    tone: 1000,
  };
  if (
    punit == "kg" ||
    punit == "man" ||
    punit == "quintal" ||
    punit == "tone"
  ) {
    pricebyKg = price / (units[punit] * units["kg"]);
  }
  if (
    wunit == "kg" ||
    wunit == "man" ||
    wunit == "quintal" ||
    wunit == "tone"
  ) {
    weightBykg = units["kg"] * units[wunit] * weight;
  }
  totalamount = weightBykg * pricebyKg;
  return totalamount;
};

module.exports = { addExpense, addIncome };

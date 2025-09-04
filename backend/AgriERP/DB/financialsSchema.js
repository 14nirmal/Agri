const mongoose = require("mongoose");
const connection = require("./Connect");
const { ObjectId } = require("mongodb");
if (!connection) {
  console.log("no connection found");
}

const expenseSchema = new mongoose.Schema({
  crop_id: { type: ObjectId, required: true },
  expense_type: { type: String, required: true },
  amount: { type: Number, required: true },
  note: { type: String },
  image_url: { type: String },
  crop_name: { type: String },
  transaction_date: { type: String },
  transaction_type: { type: String },
});

const incomeSchema = new mongoose.Schema({
  //option to select a crop by menudriven
  //currently we use this string but at a time of frontend we think about that
  crop_id: { type: ObjectId, required: true },
  transaction_type: { type: String },
  //option to select a cross by menudriven like sell , subsidy
  income_type: { type: String, required: true },
  crop_name: {
    type: String,
    required: [
      function () {
        return this.income_type == "sell";
      },
      "commodity_name is required field",
    ],
  },
  price: {
    type: Number,
    required: [
      function () {
        return this.income_type == "sell";
      },
      "price is required field",
    ],
  },
  price_unit: {
    type: String,
    required: [
      function () {
        return this.income_type == "sell";
      },
      "price_unit is required field",
    ],
  },
  weight: {
    type: Number,
    required: [
      function () {
        return this.income_type == "sell";
      },
      "weight is required field",
    ],
  },
  weight_unit: {
    type: String,
    required: [
      function () {
        return this.income_type == "sell";
      },
      "weight_unit is required field",
    ],
  },
  amount: { type: Number, required: true },
  scheme_name: {
    type: String,
    required: [
      function () {
        return this.income_type == "subsidy";
      },
      "scheme_name is required field",
    ],
  },
  trader_name: {
    type: String,
    required: [
      function () {
        return this.income_type == "sell";
      },
      "trader_name is required field",
    ],
  },
  Timestamp: { type: String },
  transaction_date: { type: String },
  note: { type: String },
  image_url: { type: String, required: false },
});

const fiancialsSchema = new mongoose.Schema({
  farm_id: { type: ObjectId, required: true },
  farmer_id: { type: ObjectId, required: true },
  //it is a categorized dropdown menu
  financial_year: { type: String, required: true, default: 2025 },
  total_income: { type: Number, default: 0 },
  total_expense: { type: Number, default: 0 },
  expenses: { type: [expenseSchema], default: [] },
  incomes: { type: [incomeSchema], default: [] },
});

fiancialsSchema.pre("save", function (next) {
  if (this.incomes) {
    this.total_income =
      this.incomes.length > 0
        ? this.incomes.reduce((sum, curr) => {
            return sum + curr.amount;
          }, 0)
        : 0;
  }
  if (this.expenses) {
    this.total_expense =
      this.expenses.length > 0
        ? this.expenses.reduce((sum, curr) => {
            return sum + curr.amount;
          }, 0)
        : 0;
    next();
  }
  next();
});

const financialModel = mongoose.model("financials", fiancialsSchema);
module.exports = financialModel;

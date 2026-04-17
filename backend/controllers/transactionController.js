import Transaction from "../models/Transaction.js";
import {calculateSurvival} from "../utils/calculateSurvival.js"


export const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, note } = req.body;

    const autoCategory = (note) => {
  note = note.toLowerCase();

  if (note.includes("swiggy") || note.includes("zomato")) return "food";
  if (note.includes("uber") || note.includes("ola")) return "travel";
  if (note.includes("amazon") || note.includes("flipkart")) return "shopping";

  return "others";
};

    const transaction = await Transaction.create({
      userId: req.user.id,
      type,
      amount,
      category: category || autoCategory(note),
      date,
      note
    });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 Get All Transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id
    }).sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete Transaction
export const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id
    });

    const summary = calculateSurvival(transactions);

// calculate today's spending
const today = new Date().toDateString();

let todaySpending = 0;

transactions.forEach(t => {
  if (
    t.type === "expense" &&
    new Date(t.date).toDateString() === today
  ) {
    todaySpending += t.amount;
  }
});

let warning = null;

if (todaySpending > summary.safeDailyLimit) {
  warning = "⚠️ You are overspending today!";
}

res.json({
  ...summary,
  todaySpending,
  warning
});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


import csv from "csv-parser";
import stream from "stream";

export const uploadCSV = async (req, res) => {
  try {
    const results = [];

    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    bufferStream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        const transactions = results.map(item => ({
          userId: req.user.id,
          type: item.type,
          amount: Number(item.amount),
          category: item.category,
          date: item.date,
          note: item.note || ""
        }));

        await Transaction.insertMany(transactions);

        res.json({ message: "CSV uploaded successfully", count: transactions.length });
      });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
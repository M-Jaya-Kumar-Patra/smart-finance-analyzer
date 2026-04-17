import express from "express";
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  getSummary,
  uploadCSV
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";


const router = express.Router();

router.post("/", protect, addTransaction);
router.get("/", protect, getTransactions);
router.delete("/:id", protect, deleteTransaction);
router.get("/summary", protect, getSummary);
router.post("/upload", protect, upload.single("file"), uploadCSV);


export default router;
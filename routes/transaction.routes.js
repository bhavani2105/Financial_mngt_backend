const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
} = require("../controllers/transaction.controller");

router.use(protect);

router.route("/").get(getTransactions).post(createTransaction);

router.route("/summary").get(getTransactionSummary);

router
  .route("/:id")
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;

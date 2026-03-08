const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
} = require("../controllers/budget.controller");

router.use(protect);

router.route("/").get(getBudgets).post(createBudget);

router.route("/summary").get(getBudgetSummary);

router.route("/:id").put(updateBudget).delete(deleteBudget);

module.exports = router;

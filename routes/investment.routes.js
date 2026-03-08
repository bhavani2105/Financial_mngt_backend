const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
  getInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment,
} = require("../controllers/investment.controller");

router.use(protect);

router.route("/").get(getInvestments).post(createInvestment);

router.route("/:id").put(updateInvestment).delete(deleteInvestment);

module.exports = router;

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
  getLiabilities,
  createLiability,
  updateLiability,
  deleteLiability,
} = require("../controllers/liability.controller");

router.use(protect);

router.route("/").get(getLiabilities).post(createLiability);

router.route("/:id").put(updateLiability).delete(deleteLiability);

module.exports = router;

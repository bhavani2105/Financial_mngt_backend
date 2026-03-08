const Investment = require("../models/Investment");

// @desc    Get all investments
// @route   GET /api/investments
// @access  Private
const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.id }).sort({
      purchaseDate: -1,
    });

    const summary = investments.reduce(
      (acc, investment) => {
        acc.totalInvested += investment.amount;
        acc.totalCurrentValue += investment.currentValue;
        acc.totalProfit += investment.currentValue - investment.amount;
        return acc;
      },
      { totalInvested: 0, totalCurrentValue: 0, totalProfit: 0 },
    );

    res.json({ investments, summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create investment
// @route   POST /api/investments
// @access  Private
const createInvestment = async (req, res) => {
  try {
    const investment = await Investment.create({
      user: req.user.id,
      ...req.body,
    });

    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update investment
// @route   PUT /api/investments/:id
// @access  Private
const updateInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true },
    );

    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    res.json(investment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete investment
// @route   DELETE /api/investments/:id
// @access  Private
const deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    res.json({ message: "Investment removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment,
};

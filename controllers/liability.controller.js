const Liability = require("../models/Liability");

// @desc    Get all liabilities
// @route   GET /api/liabilities
// @access  Private
const getLiabilities = async (req, res) => {
  try {
    const liabilities = await Liability.find({ user: req.user.id }).sort({
      dueDate: 1,
    });

    const summary = liabilities.reduce(
      (acc, liability) => {
        acc.totalAmount += liability.totalAmount;
        acc.totalRemaining += liability.remainingAmount;
        acc.totalMonthlyPayment += liability.monthlyPayment;
        return acc;
      },
      { totalAmount: 0, totalRemaining: 0, totalMonthlyPayment: 0 },
    );

    res.json({ liabilities, summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create liability
// @route   POST /api/liabilities
// @access  Private
const createLiability = async (req, res) => {
  try {
    const liability = await Liability.create({
      user: req.user.id,
      ...req.body,
    });

    res.status(201).json(liability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update liability
// @route   PUT /api/liabilities/:id
// @access  Private
const updateLiability = async (req, res) => {
  try {
    const liability = await Liability.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true },
    );

    if (!liability) {
      return res.status(404).json({ message: "Liability not found" });
    }

    res.json(liability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete liability
// @route   DELETE /api/liabilities/:id
// @access  Private
const deleteLiability = async (req, res) => {
  try {
    const liability = await Liability.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!liability) {
      return res.status(404).json({ message: "Liability not found" });
    }

    res.json({ message: "Liability removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLiabilities,
  createLiability,
  updateLiability,
  deleteLiability,
};

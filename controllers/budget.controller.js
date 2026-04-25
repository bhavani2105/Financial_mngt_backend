// const Budget = require("../models/Budget");

// const { sendBudgetAlert } = require("../utils/sendMail");
// // @desc    Get all budgets
// // @route   GET /api/budgets
// // @access  Private
// const getBudgets = async (req, res) => {
//   try {
//     const now = new Date();
//     const month = req.query.month || now.getMonth() + 1;
//     const year = req.query.year || now.getFullYear();

//     const budgets = await Budget.find({
//       user: req.user.id,
//       month: parseInt(month),
//       year: parseInt(year),
//     }).sort({ category: 1 });

//     res.json(budgets);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Create budget
// // @route   POST /api/budgets
// // @access  Private
// const createBudget = async (req, res) => {
//   try {
//     const now = new Date();
//     const budgetData = {
//       user: req.user.id,
//       month: req.body.month || now.getMonth() + 1,
//       year: req.body.year || now.getFullYear(),
//       ...req.body,
//     };

//     const budget = await Budget.create(budgetData);
//     res.status(201).json(budget);
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({
//         message: "Budget already exists for this category and month",
//       });
//     }
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Update budget
// // @route   PUT /api/budgets/:id
// // @access  Private
// const updateBudget = async (req, res) => {
//   try {
//     const budget = await Budget.findOneAndUpdate(
//       { _id: req.params.id, user: req.user.id },
//       req.body,
//       { new: true, runValidators: true },
//     );

//     if (!budget) {
//       return res.status(404).json({ message: "Budget not found" });
//     }

//     res.json(budget);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Delete budget
// // @route   DELETE /api/budgets/:id
// // @access  Private
// const deleteBudget = async (req, res) => {
//   try {
//     const budget = await Budget.findOneAndDelete({
//       _id: req.params.id,
//       user: req.user.id,
//     });

//     if (!budget) {
//       return res.status(404).json({ message: "Budget not found" });
//     }

//     res.json({ message: "Budget removed" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Get budget summary
// // @route   GET /api/budgets/summary
// // @access  Private
// // const getBudgetSummary = async (req, res) => {
// //   try {
// //     const now = new Date();
// //     const month = req.query.month || now.getMonth() + 1;
// //     const year = req.query.year || now.getFullYear();

// //     const budgets = await Budget.find({
// //       user: req.user.id,
// //       month: parseInt(month),
// //       year: parseInt(year),
// //     });

// //     const summary = budgets.reduce(
// //       (acc, budget) => {
// //         acc.totalBudget += budget.limit;
// //         acc.totalSpent += budget.spent;
// //         acc.remaining += budget.limit - budget.spent;
// //         acc.budgets.push({
// //           category: budget.category,
// //           limit: budget.limit,
// //           spent: budget.spent,
// //           remaining: budget.limit - budget.spent,
// //           // percentage: (budget.spent / budget.limit) * 100,
          
// //         });
// //         return acc;
// //       },
// //       {
// //         totalBudget: 0,
// //         totalSpent: 0,
// //         remaining: 0,
// //         budgets: [],
// //       },
// //     );

// //     res.json(summary);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };


// const getBudgetSummary = async (req, res) => {
//   try {
//     const now = new Date();
//     const month = req.query.month || now.getMonth() + 1;
//     const year = req.query.year || now.getFullYear();

//     const budgets = await Budget.find({
//       user: req.user.id,
//       month: parseInt(month),
//       year: parseInt(year),
//     });

//     // 🔔 EMAIL ALERT CHECK
//     for (const budget of budgets) {
//       if (!budget.limit || budget.limit === 0) continue;

//       const percentage = (budget.spent / budget.limit) * 100;

//       // send alert if >= 80%
//       if (percentage >= 80 && percentage < 81) {
//         await sendBudgetAlert(
//           req.user.email,
//           budget.category,
//           Math.round(percentage)
//         );
//       }
//     }

//     const summary = budgets.reduce(
//       (acc, budget) => {
//         acc.totalBudget += budget.limit;
//         acc.totalSpent += budget.spent;
//         acc.remaining += budget.limit - budget.spent;

//         acc.budgets.push({
//           category: budget.category,
//           limit: budget.limit,
//           spent: budget.spent,
//           remaining: budget.limit - budget.spent,
//           percentage: budget.limit
//             ? (budget.spent / budget.limit) * 100
//             : 0,
//         });

//         return acc;
//       },
//       {
//         totalBudget: 0,
//         totalSpent: 0,
//         remaining: 0,
//         budgets: [],
//       }
//     );

//     res.json(summary);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };




// module.exports = {
//   getBudgets,
//   createBudget,
//   updateBudget,
//   deleteBudget,
//   getBudgetSummary,
// };









const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

const { sendBudgetAlert } = require("../utils/sendMail");
// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month || now.getMonth() + 1;
    const year = req.query.year || now.getFullYear();

    const budgets = await Budget.find({
      user: req.user._id,
      month: parseInt(month),
      year: parseInt(year),
    }).sort({ category: 1 });

    // Calculate dynamic spent for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const startOfMonth = new Date(budget.year, budget.month - 1, 1);
        const endOfMonth = new Date(budget.year, budget.month, 0);

        const transactions = await Transaction.aggregate([
          {
            $match: {
              user: req.user._id,
              category: budget.category,
              type: "expense",
              date: { $gte: startOfMonth, $lte: endOfMonth },
            },
          },
          {
            $group: {
              _id: null,
              totalSpent: { $sum: "$amount" },
            },
          },
        ]);

        const spent = transactions.length > 0 ? transactions[0].totalSpent : 0;

        return {
          ...budget.toObject(),
          spent,
        };
      })
    );

    res.json(budgetsWithSpent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create budget
// @route   POST /api/budgets
// @access  Private
const createBudget = async (req, res) => {
  try {
    const now = new Date();
    const budgetData = {
      user: req.user._id,
      month: req.body.month || now.getMonth() + 1,
      year: req.body.year || now.getFullYear(),
      ...req.body,
    };

    const budget = await Budget.create(budgetData);
    res.status(201).json(budget);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Budget already exists for this category and month",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true },
    );

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Budget removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get budget summary
// @route   GET /api/budgets/summary
// @access  Private
// const getBudgetSummary = async (req, res) => {
//   try {
//     const now = new Date();
//     const month = req.query.month || now.getMonth() + 1;
//     const year = req.query.year || now.getFullYear();

//     const budgets = await Budget.find({
//       user: req.user.id,
//       month: parseInt(month),
//       year: parseInt(year),
//     });

//     const summary = budgets.reduce(
//       (acc, budget) => {
//         acc.totalBudget += budget.limit;
//         acc.totalSpent += budget.spent;
//         acc.remaining += budget.limit - budget.spent;
//         acc.budgets.push({
//           category: budget.category,
//           limit: budget.limit,
//           spent: budget.spent,
//           remaining: budget.limit - budget.spent,
//           // percentage: (budget.spent / budget.limit) * 100,
          
//         });
//         return acc;
//       },
//       {
//         totalBudget: 0,
//         totalSpent: 0,
//         remaining: 0,
//         budgets: [],
//       },
//     );

//     res.json(summary);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const getBudgetSummary = async (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month || now.getMonth() + 1;
    const year = req.query.year || now.getFullYear();
    console.log("User ID:", req.user._id);

    const budgets = await Budget.find({
      user: req.user._id,
      month: parseInt(month),
      year: parseInt(year),
    });

    const summary = {
      totalBudget: 0,
      totalSpent: 0,
      remaining: 0,
      budgets: [],
    };

    for (const budget of budgets) {
      const startOfMonth = new Date(budget.year, budget.month - 1, 1);
      const endOfMonth = new Date(budget.year, budget.month, 0);

      const transactions = await Transaction.aggregate([
        {
          $match: {
            user: req.user._id,
            category: budget.category,
            type: "expense",
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: "$amount" },
          },
        },
      ]);

      const spent = transactions.length > 0 ? transactions[0].totalSpent : 0;

      // 🔔 EMAIL ALERT CHECK
      if (budget.limit && budget.limit > 0) {
        const percentage = (spent / budget.limit) * 100;
        if (percentage >= 80 && percentage < 81) {
          try {
  if (req.user.email) {
    await sendBudgetAlert(
      req.user.email,
      budget.category,
      Math.round(percentage)
    );
  }
} catch (err) {
  console.log("Mail error:", err.message);
}
        }
      }
const limit = budget.limit || 0;

            summary.totalBudget += limit;
            summary.totalSpent += spent;
            summary.remaining += limit - spent;

      summary.budgets.push({
        category: budget.category,
        limit: budget.limit,
        spent: spent,
        remaining: budget.limit - spent,
        percentage: budget.limit ? (spent / budget.limit) * 100 : 0,
      });
    }

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
};

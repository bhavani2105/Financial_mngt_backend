// const Tesseract = require("tesseract.js");
// const Transaction = require("../models/Transaction");

// const scanReceipt = async (req, res) => {
//   try {
//     const image = req.file.buffer;

//     const result = await Tesseract.recognize(image, "eng");

//     const text = result.data.text;

//     // find numbers that look like amount
//     const amountMatch = text.match(/\d+\.\d{2}/);

//     const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;

//     const transaction = await Transaction.create({
//       user: req.user.id,
//       type: "expense",
//       category: "Receipt",
//       amount: amount,
//       description: "Receipt Scan",
//       date: new Date(),
//     });

//     res.json({
//       message: "Receipt scanned successfully",
//       amount,
//       text,
//       transaction,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { scanReceipt };









// const Tesseract = require("tesseract.js");
// const Transaction = require("../models/Transaction");

// const scanReceipt = async (req, res) => {
//   try {
//     const image = req.file.buffer;

//     const result = await Tesseract.recognize(image, "eng");

//     const text = result.data.text;

//     const amountMatch = text.match(/\d+\.\d{2}/);
//     const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;

//     const transaction = await Transaction.create({
//       user: req.user.id,
//       type: "expense",
//       category: "Receipt",
//       amount,
//       description: "Receipt Scan",
//       date: new Date(),
//     });

//     res.json({
//       message: "Receipt scanned successfully",
//       amount,
//       transaction,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { scanReceipt };





// const Tesseract = require("tesseract.js");
// const Transaction = require("../models/Transaction");

// const scanReceipt = async (req, res) => {
//   try {

//     if (!req.file) {
//       return res.status(400).json({ message: "No receipt uploaded" });
//     }

//     const image = req.file.buffer;

//     const result = await Tesseract.recognize(image, "eng");

//     const text = result.data.text;

//     const amountMatch = text.match(/\d+\.\d{2}/);
//     const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;

//     // const transaction = await Transaction.create({
//     //   user: req.user.id,
//     //   type: "expense",
//     //   category: "Receipt",
//     //   amount,
//     //   description: "Receipt Scan",
//     //   date: new Date(),
//     // });



//     const transaction = await Transaction.create({
//   // user: req.user?.id,
//   user: null,
//   type: "expense",
//   category: "Receipt",
//   amount,
//   description: "Receipt Scan",
//   date: new Date(),
// });

//     res.json({
//       message: "Receipt scanned successfully",
//       amount,
//       transaction,
//     });

//   } catch (error) {
//     console.log(error);   // important for debugging
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { scanReceipt };



const Tesseract = require("tesseract.js");
const Transaction = require("../models/Transaction");

const scanReceipt = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No receipt uploaded" });
    }

    const image = req.file.buffer;

    const result = await Tesseract.recognize(image, "eng");

    const text = result.data.text || "";

    const amountMatch = text.match(/\d+(\.\d{2})?/);

    const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;

    // const transaction = await Transaction.create({
    //   user: null,
    //   type: "expense",
    //   category: "Receipt",
    //   amount,
    //   description: "Receipt Scan",
    //   date: new Date(),
    // });





    const transaction = await Transaction.create({
  type: "expense",
  category: "Receipt",
  amount,
  description: "Receipt Scan",
  date: new Date(),
});

    res.json({
      message: "Receipt scanned successfully",
      amount,
      transaction
    });

  } catch (error) {
    console.log("Receipt Scan Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { scanReceipt };
// import nodemailer from "nodemailer";

// export const sendBudgetAlert = async (email, category, percentage) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "⚠ Budget Alert Notification",
//       html: `
//         <h2>Budget Alert</h2>
//         <p>You have used <b>${percentage}%</b> of your <b>${category}</b> budget.</p>
//         <p>Please review your spending.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Budget alert email sent");
//   } catch (error) {
//     console.error("Email error:", error);
//   }
// };





const nodemailer = require("nodemailer");

const sendBudgetAlert = async (email, category, percentage) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "⚠ Budget Alert",
    html: `
      <h3>Budget Alert</h3>
      <p>You have used <b>${percentage}%</b> of your <b>${category}</b> budget.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendBudgetAlert };
// // // const express = require("express");
// // // const router = express.Router();

// // // const upload = require("../middleware/upload");
// // // const protect = require("../middleware/auth.middleware");
// // // const { scanReceipt } = require("../controllers/receiptController");

// // // // router.post("/scan", protect, upload.single("receipt"), scanReceipt);



// // // router.post("/scan", upload.single("receipt"), scanReceipt);
// // // module.exports = router;



// // const express = require("express");
// // const router = express.Router();

// // const upload = require("../middleware/upload");
// // const { scanReceipt } = require("../controllers/receiptController");

// // // temporary without auth to avoid errors
// // router.post("/scan", upload.single("receipt"), scanReceipt);

// // module.exports = router;



// const express = require("express");
// const router = express.Router();

// const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });

// const { scanReceipt } = require("../controllers/receiptController");
// // const authMiddleware = require("../middleware/auth.middleware");

// router.post("/scan", authMiddleware, upload.single("receipt"), scanReceipt);

// module.exports = router;





const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { scanReceipt } = require("../controllers/receiptController");

router.post("/scan", upload.single("receipt"), scanReceipt);

module.exports = router;
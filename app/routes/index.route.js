const express = require("express");
const router = express.Router();
const indexCont = require("../controllers/index.cont");

router.get("/", indexCont.index);
module.exports = router;

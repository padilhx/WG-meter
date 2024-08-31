"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const confirmController_1 = require("../controllers/confirmController");
const router = (0, express_1.Router)();
router.patch('/confirm', confirmController_1.confirmController);
exports.default = router;

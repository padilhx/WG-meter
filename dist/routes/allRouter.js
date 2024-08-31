"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const allController_1 = require("../controllers/allController");
const router = (0, express_1.Router)();
router.post('/upload', allController_1.uploadController);
router.get('/readings/:customer_code', allController_1.listController);
router.patch('/confirm', allController_1.confirmController);
exports.default = router;

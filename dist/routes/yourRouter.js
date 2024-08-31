"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const yourController_1 = require("../controllers/yourController");
const router = (0, express_1.Router)();
router.post('/upload', yourController_1.uploadController);
router.get('/readings/:customer_code', yourController_1.listReadingsController);
router.patch('/confirm', yourController_1.confirmReadingController);
exports.default = router;

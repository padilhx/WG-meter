"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const router = (0, express_1.Router)();
/**
 * Rota para upload de imagens e leitura de medidores
 * POST /upload
 */
router.post('/upload', uploadController_1.uploadController);
exports.default = router;

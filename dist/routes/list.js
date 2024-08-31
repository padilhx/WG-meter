"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const listController_1 = require("../controllers/listController");
const router = (0, express_1.Router)();
/**
 * Rota para listar as medidas de um cliente.
 * GET /<customer_code>/list
 */
router.get('/:customer_code/list', listController_1.listController);
exports.default = router;

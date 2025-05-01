"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const route = (0, express_1.Router)();
exports.default = route.get("/order/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield prisma_1.default.orderData.findUnique({
            where: { unique_id: req.params.id },
            include: {
                customer: true,
                event: true,
                sections: {
                    include: {
                        portions: true,
                    },
                },
            },
        });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch order" });
    }
}));

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
exports.default = route.delete("/order/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // delete portions, sections, event, customer manually (or rely on cascade if set)
        yield prisma_1.default.portionTable.deleteMany({
            where: {
                section: {
                    order_id: id,
                },
            },
        });
        yield prisma_1.default.sectionTable.deleteMany({
            where: {
                order_id: id,
            },
        });
        yield prisma_1.default.eventDetails.deleteMany({
            where: {
                id: id,
            },
        });
        yield prisma_1.default.customerDetails.deleteMany({
            where: {
                id: id,
            },
        });
        yield prisma_1.default.orderData.delete({
            where: { unique_id: id },
        });
        res.status(200).json({ message: "Order deleted successfully." });
    }
    catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: "Failed to delete order" });
    }
}));

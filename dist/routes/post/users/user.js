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
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../../../lib/prisma"));
const router = (0, express_1.Router)();
exports.default = router.post("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const key = process.env.CRYPTO_KEY || "KEY";
    if (!username || !password) {
        res.json({
            error: "Missing username or password",
            status: 400
        });
    }
    const hashedPassword = crypto_1.default.createHmac('sha256', key).update(password).digest('hex');
    const db = yield prisma_1.default.users.create({
        data: {
            username,
            password: hashedPassword
        }
    });
    res.status(201).json({
        data: db,
        status: 201
    });
}));

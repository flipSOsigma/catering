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
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
router.post("/auth", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    console.log(username, password);
    if (!username || !password) {
        return res.status(400).json({
            status: 400,
            msg: "tolong lengkapi form di bawah ini",
        });
    }
    try {
        const key = process.env.CRYPTO_KEY || "KEY";
        const hashedPassword = crypto_1.default
            .createHmac("sha256", key)
            .update(password.toString())
            .digest("hex");
        const findUser = yield prisma_1.default.users.findUnique({
            where: { username },
        });
        if (!findUser) {
            return res.status(404).json({
                status: 404,
                msg: "username tidak ditemukan",
            });
        }
        if (findUser.password !== hashedPassword) {
            return res.status(401).json({
                status: 401,
                msg: "password anda salah",
            });
        }
        const token = crypto_1.default.randomBytes(16).toString("hex");
        const auth = yield prisma_1.default.authentication.create({
            data: {
                token,
                userId: findUser.id,
                expired: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 hari
            },
        });
        return res.status(200).json({
            status: 200,
            msg: "Login success",
            data: auth,
        });
    }
    catch (error) {
        console.error("Auth error:", error);
        return res.status(500).json({
            status: 500,
            msg: "terjadi kesalahan dalam server",
        });
    }
}));
exports.default = router;

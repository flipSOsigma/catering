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
const router = (0, express_1.Router)();
exports.default = router.get("/auth/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const findToken = yield prisma_1.default.authentication.findMany({
        where: {
            token
        }
    });
    if (findToken.length == 0) {
        res.json({
            data: findToken,
            msg: "Token tidak di temukan",
            status: 400
        });
    }
    else {
        const expiredDate = findToken[0].expired;
        if (expiredDate < new Date(Date.now())) {
            res.json({
                data: findToken,
                msg: "Token telah kadaluarsa, perbarui login anda",
                status: 401
            });
        }
        else {
            res.json({
                data: findToken,
                userData: yield prisma_1.default.users.findUnique({
                    where: {
                        id: findToken[0].userId
                    }
                }),
                status: 200
            });
        }
    }
}));

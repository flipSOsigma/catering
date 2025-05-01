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
exports.default = route.post("/order", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { event_name, created_at, updated_at, invitation, visitor, note, price, portion, customer, events, sections, } = req.body;
        const newOrder = yield prisma_1.default.orderData.create({
            data: {
                event_name,
                created_at: new Date(created_at),
                updated_at: new Date(updated_at),
                invitation,
                visitor,
                note,
                price,
                portion,
                customer: {
                    create: {
                        customer_name: customer.customer_name,
                        customer_phone: customer.customer_phone,
                        customer_email: customer.customer_email,
                    },
                },
                event: {
                    create: {
                        event_name: events.event_name,
                        event_location: events.event_location,
                        event_date: new Date(events.event_date),
                        event_building: events.event_building,
                        event_category: events.event_category,
                        event_time: events.event_time,
                    },
                },
                sections: {
                    create: sections.map((section) => ({
                        section_name: section.section_name,
                        section_note: section.section_note,
                        section_price: section.section_price,
                        section_portion: section.section_portion,
                        section_total_price: section.section_total_price,
                        portions: {
                            create: section.portions.map((portion) => ({
                                portion_name: portion.portion_name,
                                portion_note: portion.portion_note,
                                portion_count: portion.portion_count,
                                portion_price: portion.portion_price,
                                portion_total_price: portion.portion_total_price,
                                section_id: section.id, // Ensure section_id is valid
                            })),
                        },
                    })),
                },
            },
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
        res.status(201).json(newOrder);
    }
    catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
}));

"use strict";
// routes/order/putOrder.ts
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
exports.default = route.put("/order/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { event_name, created_at, updated_at, invitation, visitor, note, price, portion, customer, event, sections, } = req.body;
    console.log(req.body);
    try {
        const updatedOrder = yield prisma_1.default.orderData.update({
            where: { unique_id: id },
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
                    upsert: {
                        update: {
                            customer_name: customer.customer_name,
                            customer_phone: customer.customer_phone,
                            customer_email: customer.customer_email,
                        },
                        create: {
                            customer_name: customer.customer_name,
                            customer_phone: customer.customer_phone,
                            customer_email: customer.customer_email,
                        },
                    },
                },
                event: {
                    upsert: {
                        update: {
                            event_name: event.event_name,
                            event_location: event.event_location,
                            event_date: new Date(event.event_date),
                            event_building: event.event_building,
                            event_category: event.event_category,
                            event_time: event.event_time,
                        },
                        create: {
                            event_name: event.event_name,
                            event_location: event.event_location,
                            event_date: new Date(event.event_date),
                            event_building: event.event_building,
                            event_category: event.event_category,
                            event_time: event.event_time,
                        },
                    },
                },
                // Delete old sections and recreate them
                sections: {
                    deleteMany: {}, // remove all related sections
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
        res.status(200).json(updatedOrder);
    }
    catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "Failed to update order" });
    }
}));

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
const prisma_1 = __importDefault(require("../../../lib/prisma"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const route = (0, express_1.Router)();
exports.default = route.post("/order", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { event_name, invitation, visitor, note, price, portion, customer, event, sections, } = req.body;
        const newOrder = yield prisma_1.default.orderData.create({
            data: {
                event_name,
                created_at: new Date(),
                updated_at: new Date(),
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
                        event_name: event.event_name,
                        event_location: event.event_location,
                        event_date: new Date(event.event_date),
                        event_building: event.event_building,
                        event_category: event.event_category,
                        event_time: event.event_time,
                    },
                },
                sections: {
                    create: sections.map((section) => {
                        // Base section data
                        const sectionData = {
                            section_name: section.section_name,
                            section_note: section.section_note,
                            section_price: section.section_price,
                            section_portion: section.section_portion,
                            section_total_price: section.section_total_price,
                        };
                        // Only add portions if they exist and are not empty
                        if (section.portions && section.portions.length > 0) {
                            sectionData.portions = {
                                create: section.portions.map((portion) => ({
                                    portion_name: portion.portion_name,
                                    portion_note: portion.portion_note,
                                    portion_count: portion.portion_count,
                                    portion_price: portion.portion_price,
                                    portion_total_price: portion.portion_total_price,
                                })),
                            };
                        }
                        return sectionData;
                    }),
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
        const html = `
      <div style="font-family: sans-serif; color: #333;">
        <h2>Konfirmasi Pesanan Ricebox</h2>
        <p>Halo <strong>${customer.customer_name}</strong>,</p>
        <p>Terima kasih telah melakukan pemesanan. Berikut adalah detail pesanan Anda:</p>

        <h3>📅 Detail Acara</h3>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
          <tr><th>Nama Acara</th><td>${event.event_name}</td></tr>
          <tr><th>Tanggal</th><td>${event.event_date}</td></tr>
          <tr><th>Waktu</th><td>${event.event_time}</td></tr>
          <tr><th>Tempat</th><td>${event.event_building} — ${event.event_location}</td></tr>
          <tr><th>Kategori</th><td>${event.event_category}</td></tr>
        </table>

        <h3>👤 Data Pemesan</h3>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
          <tr><th>Nama</th><td>${customer.customer_name}</td></tr>
          <tr><th>Email</th><td>${customer.customer_email}</td></tr>
          <tr><th>Telepon</th><td>${customer.customer_phone}</td></tr>
        </table>

        <h3>🍱 Rincian Pesanan</h3>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <thead style="background-color: #f0f0f0;">
            <tr>
              <th>Menu</th>
              <th>Jumlah</th>
              <th>Harga Satuan</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${sections.map((section) => section.portions.map((portion) => `
                <tr>
                  <td>${portion.portion_name}</td>
                  <td>${portion.portion_count}</td>
                  <td>Rp ${portion.portion_price.toLocaleString()}</td>
                  <td>Rp ${portion.portion_total_price.toLocaleString()}</td>
                </tr>
              `).join('')).join('')}
          </tbody>
        </table>

        <p><strong>Total Keseluruhan: Rp ${price.toLocaleString()}</strong></p>

        <p>Jika ada perubahan, silakan hubungi kami kembali.</p>
        <p>Salam, <br/>Tim Wedding App</p>
      </div>
    `;
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com', // For Gmail
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER, // your Gmail
                pass: process.env.APP_PASSWORD, // App Password (not your Gmail password)
            },
        });
        const info = yield transporter.sendMail({
            from: `Marketing Anisa Catering | <${process.env.EMAIL_USER}>`,
            to: customer.customer_email,
            subject: "Anisa Catering Order Confirmation",
            html
        });
        res.status(201).json({
            data: newOrder,
            email: info
        });
    }
    catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
}));

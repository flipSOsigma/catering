import express from 'express';
import multer from 'multer';
import { parseOrderXLS } from '../../lib/xlsx-configuration';
import nodemailer from 'nodemailer';  // Add this import
import prisma from '../../lib/prisma'; // Assuming you import prisma client here

const upload = multer();
const router = express.Router();

router.post('/order/xlsx', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');

  try {
    // Parse the Excel buffer to get order data
    const orderData = parseOrderXLS(req.file.buffer);

    // Destructure from parsed data for clarity
    const {
      event_name,
      created_at,
      invitation,
      visitor,
      note,
      price,
      portion,
      customer,
      event,
      sections,
    } = orderData;

    // Create order in DB using prisma
    const newOrder = await prisma.orderData.create({
      data: {
        event_name,
        created_at,
        updated_at: new Date(),
        invitation,
        visitor,
        note,
        price,
        portion,
        created_by: 'admin',
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
          create: sections.map(section => {
            const sectionData: any = {
              section_name: section.section_name,
              section_note: section.section_note,
              section_price: section.section_price,
              section_portion: section.section_portion,
              section_total_price: section.section_total_price,
            };

            if (section.portions && section.portions.length > 0) {
              sectionData.portions = {
                create: section.portions.map(portion => ({
                  portion_name: portion.portion_name,
                  portion_note: portion.portion_note || '',
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
            ${sections.map(section => 
              section.portions.map(portion => `
                <tr>
                  <td>${portion.portion_name}</td>
                  <td>${portion.portion_count}</td>
                  <td>Rp ${portion.portion_price.toLocaleString()}</td>
                  <td>Rp ${portion.portion_total_price.toLocaleString()}</td>
                </tr>
              `).join('')
            ).join('')}
          </tbody>
        </table>

        <p><strong>Total Keseluruhan: Rp ${price.toLocaleString()}</strong></p>

        <p>Jika ada perubahan, silakan hubungi kami kembali.</p>
        <p>Salam, <br/>Tim Wedding App</p>
      </div>
    `;

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    // Send confirmation email
    const info = await transporter.sendMail({
      from: `Marketing Anisa Catering | <${process.env.EMAIL_USER}>`,
      to: customer.customer_email,
      subject: "Anisa Catering Order Confirmation",
      html,
    });

    // Send success response with new order data and email info
    res.status(201).json({
      data: newOrder,
      email: info,
      success: true,
    });

  } catch (error) {
    console.error('Order XLSX upload failed:', error);
    res.status(500).send('Failed to parse or save file');
  }
});

export default router;

// routes/order/putOrder.ts

import { Router } from "express";
import prisma from "../../lib/prisma";

const route = Router()

export default route.put("/order/:id", async (req, res) => {
  const { id } = req.params;
  const {
    event_name,
    created_at,
    updated_at,
    invitation,
    visitor,
    note,
    price,
    portion,
    customer,
    event,
    sections,
    updated_by
  } = req.body;

  console.log(updated_by);

  try {
    const updatedOrder = await prisma.orderData.update({
      where: { unique_id: id },
      data: {
        event_name,
        created_at: new Date(created_at),
        updated_at: new Date(Date.now()),
        invitation,
        visitor,
        note,
        price,
        portion,
        updated_by,

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
          create: sections.map((section: any) => ({
            section_name: section.section_name,
            section_note: section.section_note,
            section_price: section.section_price,
            section_portion: section.section_portion,
            section_total_price: section.section_total_price,
            portions: {
              create: section.portions.map((portion: any) => ({
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
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
})
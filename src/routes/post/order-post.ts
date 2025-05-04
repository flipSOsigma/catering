import { Router } from "express";
import prisma from "../../lib/prisma";

const route = Router()

export default route.post("/order", async (req, res) => {
  try {
    const {
      event_name,
      invitation,
      visitor,
      note,
      price,
      portion,
      customer,
      event,
      sections,
    } = req.body;

    const newOrder = await prisma.orderData.create({
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
          create: sections.map((section: any) => {
            // Base section data
            const sectionData: any = {
              section_name: section.section_name,
              section_note: section.section_note,
              section_price: section.section_price,
              section_portion: section.section_portion,
              section_total_price: section.section_total_price,
            };

            // Only add portions if they exist and are not empty
            if (section.portions && section.portions.length > 0) {
              sectionData.portions = {
                create: section.portions.map((portion: any) => ({
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

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});
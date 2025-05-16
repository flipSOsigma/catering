import { Router } from "express";
import prisma from "../../../lib/prisma";
const route = Router()

export default route.get("/orders", async (req, res) => {
  try {
    const orders = await prisma.orderData.findMany({
      include: {
        customer: true,
        event: true,
        sections: {
          include: {
            portions: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});
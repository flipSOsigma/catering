import { Router } from "express";
import prisma from "../../lib/prisma";
const route = Router()

export default route.get("/order/:id", async (req, res) => {
  try {
    const order = await prisma.orderData.findUnique({
      where: { unique_id: req.params.id },
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

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});
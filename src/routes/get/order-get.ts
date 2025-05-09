import { Router } from "express";
import prisma from "../../lib/prisma";
const route = Router()

export default route.get("/order/:id", async (req, res) => {
  const { id } = req.params;
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
      where: {
        unique_id: id
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
import { Router } from "express";
import prisma from "../../lib/prisma";
const route = Router()

export default route.get("/order/:category", async (req, res) => {
  const { category } =  req.params
  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);

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
        event: {
          event_category: capitalizedCategory
        }
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
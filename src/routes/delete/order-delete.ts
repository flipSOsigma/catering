import { Router } from "express";
import prisma from "../../lib/prisma";

const route = Router()

export default route.delete("/order/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // delete portions, sections, event, customer manually (or rely on cascade if set)
    await prisma.portionTable.deleteMany({
      where: {
        section: {
          order_id: id,
        },
      },
    });

    await prisma.sectionTable.deleteMany({
      where: {
        order_id: id,
      },
    });

    await prisma.eventDetails.deleteMany({
      where: {
        id: id,
      },
    });

    await prisma.customerDetails.deleteMany({
      where: {
        id: id,
      },
    });

    await prisma.orderData.delete({
      where: { unique_id: id },
    });

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
})
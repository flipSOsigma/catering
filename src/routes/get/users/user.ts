import { Router } from "express";
import prisma from "../../../lib/prisma";

const router = Router()

export default router.get("/user/:params", async (req, res) => {
  const { params } = req.params
  const db = await prisma.users.findMany({
    where: {
      OR: [
        {
          username: params
        },
        {
          id: params
        }
      ]
    }
  })
  res.json({
    data: db,
    length: db.length,
    status: 200
  })
})
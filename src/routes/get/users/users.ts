import { Router } from "express";
import prisma from "../../../lib/prisma";

const router = Router()

export default router.get("/users", async (req, res) => {
  const db = await prisma.users.findMany()
  res.json({
    data: db,
    status: 200
  })
})
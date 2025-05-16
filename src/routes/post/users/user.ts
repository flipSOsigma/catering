import { Router } from "express";
import crypto from "crypto";
import prisma from "../../../lib/prisma";

const router = Router()

export default router.post("/user", async (req, res) => {
  const { username, password } = req.body
  const key = process.env.CRYPTO_KEY || "KEY"

  if( !username || !password) {
    res.json({
      error: "Missing username or password",
      status: 400
    })
  }

  const hashedPassword = crypto.createHmac('sha256', key).update(password).digest('hex');
  const db = await prisma.users.create({
    data: {
      username,
      password: hashedPassword
    }
  })

  res.status(201).json({
    data: db,
    status: 201
  });
})
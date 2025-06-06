import { Router } from "express";
import prisma from "../../lib/prisma";
import crypto from "crypto";

const router = Router();

router.post("/auth", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: 400,
      msg: "tolong lengkapi form di bawah ini",
    });
  }

  

  try {
    const key = process.env.CRYPTO_KEY || "KEY";

    const hashedPassword = crypto
      .createHmac("sha256", key)
      .update(password.toString())
      .digest("hex");

    const findUser = await prisma.users.findMany({
      where: { username },
    });

    if (findUser.length <= 0) {
      return res.status(404).json({
        status: 404,
        msg: "username tidak ditemukan",
      });
    }

    if (findUser[0].password !== hashedPassword) {
      return res.status(401).json({
        status: 401,
        msg: "password anda salah",
      });
    }

    const token = crypto.randomBytes(16).toString("hex");

    const auth = await prisma.authentication.create({
      data: {
        token,
        userId: findUser[0].id,
        expired: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 hari
      },
    });

    return res.status(200).json({
      status: 200,
      msg: "Login success",
      data: {auth, user: findUser[0]},
    });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({
      status: 500,
      msg: "terjadi kesalahan dalam server",
    });
  }
});

export default router;

import { Router } from "express";
import prisma from "../../lib/prisma";
import crypto from "crypto";

const router = Router();

router.post("/auth", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password)

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

    const findUser = await prisma.users.findUnique({
      where: { username },
    });

    if (!findUser) {
      return res.status(404).json({
        status: 404,
        msg: "username tidak ditemukan",
      });
    }

    if (findUser.password !== hashedPassword) {
      return res.status(401).json({
        status: 401,
        msg: "password anda salah",
      });
    }

    const token = crypto.randomBytes(16).toString("hex");

    const auth = await prisma.authentication.create({
      data: {
        token,
        userId: findUser.id,
        expired: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 hari
      },
    });

    return res.status(200).json({
      status: 200,
      msg: "Login success",
      data: auth,
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

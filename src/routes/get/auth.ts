import { Router } from "express";
import prisma from "../../lib/prisma";

const router = Router()
export default router.get("/auth/:token", async (req, res) => {
  const { token } = req.params

  const findToken = await prisma.authentication.findMany({
    where: {
      token
    }
  })

  if(findToken.length == 0)  {
    res.json({
      data: findToken,
      msg: "Token tidak di temukan",
      status: 400
    })
  }else{
    const expiredDate = findToken[0].expired
    if(expiredDate < new Date(Date.now())) {
      res.json({
        data: findToken,
        msg: "Token telah kadaluarsa, perbarui login anda",
        status: 401
      })
    } else {
      res.json({
        data: findToken,
        userData: await prisma.users.findUnique({
          where: {
            id: findToken[0].userId
          }
        }),
        status: 200
      })
    }
  }
})
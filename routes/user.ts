import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const client = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const { account, password } = req.body;

    if (!account || !password) {
      return res.json({
        ok: false,
        message: "Not exist data.",
      });
    }

    const existUser = await client.user.findUnique({
      where: {
        account,
      },
    });

    if (existUser) {
      return res.json({
        ok: false,
        message: "Already exist user.",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await client.user.create({
      data: {
        account,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ account }, process.env.JWT_SECRET_KEY!);

    return res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;

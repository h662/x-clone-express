import express, { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface JwtPayload {
  account: string;
}

const router = express.Router();

const client = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const { account, password } = req.body;

    if (!account || !password) {
      return res.json({
        ok: false,
        message: "Account and password are required.",
      });
    }

    const user = await client.user.findUnique({
      where: {
        account,
      },
    });

    if (!user) {
      return res.json({
        ok: false,
        message: "Not exist user.",
      });
    }

    const comparePassword = bcrypt.compareSync(password, user.password);

    if (!comparePassword) {
      return res.json({
        ok: false,
        message: "Incorrect password.",
      });
    }

    const token = jwt.sign({ account }, process.env.JWT_SECRET_KEY!);

    return res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.error(error);
  }
});

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.substring(7);

    if (!token) {
      return res.status(400).json({
        ok: false,
        message: "Not exist token.",
      });
    }

    const { account } = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as JwtPayload;

    req.account = account;

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
};

export default router;

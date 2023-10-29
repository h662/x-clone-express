import express, { Request } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "./auth";

const router = express.Router();

const client = new PrismaClient();

router.put("/", async (req, res) => {
  try {
    const { postId, commentId } = req.body;
    const { account } = req;

    console.log(account);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

export default router;

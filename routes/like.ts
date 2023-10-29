import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "./auth";

const router = express.Router();

const client = new PrismaClient();

router.put("/", verifyToken, async (req, res) => {
  try {
    const { postId } = req.query;
    const { account } = req;

    if (!postId) {
      return res.status(400).json({
        ok: false,
        message: "Not exist data.",
      });
    }

    const user = await client.user.findUnique({
      where: {
        account,
      },
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "Not exist user.",
      });
    }

    const post = await client.post.findUnique({
      where: {
        id: +postId,
      },
    });

    if (!post) {
      return res.status(400).json({
        ok: false,
        message: "Not exist post.",
      });
    }

    let like = await client.like.findFirst({
      where: {
        postId: +postId,
      },
    });

    if (!like) {
      like = await client.like.create({
        data: {
          postId: +postId,
        },
      });
    }

    await client.like.update({
      where: {
        id: like.id,
      },
      data: {
        isLiked: true,
      },
    });

    return res.json({
      ok: true,
      like,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

router.put("/", verifyToken, async (req, res) => {
  try {
    const { commentId } = req.query;
    const { account } = req;

    if (!commentId) {
      return res.status(400).json({
        ok: false,
        message: "Not exist data.",
      });
    }

    const user = await client.user.findUnique({
      where: {
        account,
      },
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "Not exist user.",
      });
    }

    const comment = await client.comment.findUnique({
      where: {
        id: +commentId,
      },
    });

    if (!comment) {
      return res.status(400).json({
        ok: false,
        message: "Not exist comment.",
      });
    }

    let like = await client.like.findFirst({
      where: {
        commentId: +commentId,
      },
    });

    if (!like) {
      like = await client.like.create({
        data: {
          commentId: +commentId,
        },
      });
    }

    await client.like.update({
      where: {
        id: like.id,
      },
      data: {
        isLiked: true,
      },
    });

    return res.json({
      ok: true,
      like,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

export default router;

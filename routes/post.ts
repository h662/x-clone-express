import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "./auth";

const router = express.Router();

const client = new PrismaClient();

router.post("/", verifyToken, async (req: any, res) => {
  try {
    const { content } = req.body;
    const { account } = req;

    if (!content) {
      return res.status(400).json({
        ok: false,
        message: "Not exist content.",
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

    const post = await client.post.create({
      data: {
        content,
        userId: user.id,
      },
    });

    return res.json({ ok: true, post });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const { page } = req.query;

    if (!page) {
      return res.status(400).json({
        ok: false,
        message: "Not exist page.",
      });
    }

    const posts = await client.post.findMany({
      skip: +page * 3,
      take: 3,
      select: {
        id: true,
        content: true,
        userId: true,
        user: {
          select: {
            account: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    if (posts.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Not exist posts.",
      });
    }

    return res.json({ ok: true, posts });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "Not exist data.",
      });
    }

    const post = await client.post.findFirst({
      where: {
        id: +id,
      },
      select: {
        id: true,
        content: true,
        userId: true,
        user: {
          select: {
            account: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(400).json({
        ok: false,
        message: "Not exist post.",
      });
    }

    return res.json({ ok: true, post });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { page } = req.query;

    if (!userId || !page) {
      return res.status(400).json({
        ok: false,
        message: "Not exist data.",
      });
    }

    const posts = await client.post.findMany({
      where: {
        userId: +userId,
      },
      skip: +page * 3,
      take: 3,
      select: {
        id: true,
        content: true,
        userId: true,
        user: {
          select: {
            account: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    if (posts.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Not exist posts.",
      });
    }

    return res.json({ ok: true, posts });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

router.put("/:id", verifyToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const { account } = req;

    if (!id || !content) {
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

    const existPost = await client.post.findUnique({
      where: {
        id: +id,
      },
    });

    if (!existPost || existPost.userId !== user.id) {
      return res.status(400).json({
        ok: false,
        message: "Can not access.",
      });
    }

    const newPost = await client.post.update({
      where: {
        id: +id,
      },
      data: {
        content,
      },
    });

    return res.json({ ok: true, post: newPost });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

router.delete("/:id", verifyToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { account } = req;

    if (!id) {
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

    const existPost = await client.post.findUnique({
      where: {
        id: +id,
      },
    });

    if (!existPost || existPost.userId !== user.id) {
      return res.status(400).json({
        ok: false,
        message: "Can not access.",
      });
    }

    const deletedPost = await client.post.delete({
      where: {
        id: +id,
      },
    });

    return res.json({ ok: true, post: deletedPost });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

export default router;

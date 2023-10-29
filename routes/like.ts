import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "./auth";

const router = express.Router();

const client = new PrismaClient();

export default router;

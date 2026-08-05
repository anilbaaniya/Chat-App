import express from "express";
import { generateSignature } from "../controllers/generateSignature.js";

export const signRoute = express.Router();

signRoute.post("/", generateSignature);

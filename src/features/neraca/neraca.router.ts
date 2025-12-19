import express from "express";
import neracaController from "./neraca.controller";
import { authenticate } from "../../middleware/Authentication";

const router = express.Router();

router.get("/", authenticate, neracaController.getNeraca);

export default router;

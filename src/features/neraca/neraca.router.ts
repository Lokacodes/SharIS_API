import express from "express";
import neracaController from "./neraca.controller";
import { authenticate } from "../../middleware/Authentication";
import { authorize } from "../../middleware/Authorization";

const router = express.Router();

router.get("/", authenticate, authorize(["SUPERADMIN", "SEKRETARIS", "KETUA"]), neracaController.getNeraca);

export default router;

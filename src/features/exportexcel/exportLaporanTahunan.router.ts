import express from "express";
const router = express.Router()

import { exportLaporanTahunan } from "./exportLaporanTahunan";
import { authenticate } from "../../middleware/Authentication";
import { asyncHandler } from "../../utils/asyncHandlers";
import { authorize } from "../../middleware/Authorization";

router.get('/', authenticate, authorize(["KETUA", "SEKRETARIS", "SUPERADMIN"]), asyncHandler(exportLaporanTahunan));

export default router;
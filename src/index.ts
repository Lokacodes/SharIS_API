import express, { Application, NextFunction, Request, Response } from "express"
import dotenv from "dotenv"
import { errorHandler } from "./utils/errorHandler";
import { JSONFormatError } from "./middleware/JSONFormatError";
import cors from "cors";


const app: Application = express()
dotenv.config()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(JSONFormatError);

import memberRouter from "./features/member/member.router";
app.use("/members", memberRouter)

import authRouter from "./features/auth/auth.router"
app.use("/auth", authRouter)

import loanRouter from "./features/loan/loan.router"
app.use("/loan", loanRouter)

import installmentRouter from "./features/installment/installment.router"
app.use("/installment", installmentRouter)

import savingRouter from "./features/saving/saving.router";
app.use("/saving", savingRouter)

import loanOptionRouter from "./features/loanCmb/loanOption.router"
app.use("/loanCmb", loanOptionRouter)


import tenorOptionRouter from "./features/tenorCmb/tenorOption.router"
app.use("/tenorCmb", tenorOptionRouter)

import cashRouter from "./features/cashbook/cashbook.router"
app.use("/cashbook", cashRouter)

import SHURouter from "./features/shu/SHU.router"
app.use("/shu", SHURouter)

import SHUConfigRouter from "./features/shu_config/shu_config.router"
app.use("/shuConfig", SHUConfigRouter)

import NeracaRouter from "./features/neraca/neraca.router"
app.use("/neraca", NeracaRouter)

import exportLaporanTahunan from "./features/exportexcel/exportLaporanTahunan.router"
app.use("/export", exportLaporanTahunan)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
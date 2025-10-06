import express, { Application, NextFunction, Request, Response } from "express"
import dotenv from "dotenv"
import { errorHandler } from "./utils/errorHandler";
import { JSONFormatError } from "./middleware/JSONFormatError";

const app: Application = express()
dotenv.config()

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

app.use(errorHandler)

app.listen(port, () => {
    `udah nyala di port ${port}`
});
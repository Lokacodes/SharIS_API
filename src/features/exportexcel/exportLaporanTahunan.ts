import { Request, Response } from "express"
import XLSX from "xlsx-js-style"
import NeracaService from "../neraca/neraca.service"
import SHUService from "../shu/SHU.service"

/* =========================
   Helper: Border by Range
========================= */
function addBorderRange(ws: XLSX.WorkSheet, range: string) {
    const r = XLSX.utils.decode_range(range)

    for (let R = r.s.r; R <= r.e.r; ++R) {
        for (let C = r.s.c; C <= r.e.c; ++C) {
            const addr = XLSX.utils.encode_cell({ r: R, c: C })

            if (!ws[addr]) {
                ws[addr] = { t: "s", v: "" }
            }

            ws[addr].s = {
                ...(ws[addr].s || {}),
                border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                },
            }
        }
    }
}

/* =========================
   Helper: Bold + Center
========================= */
function setBoldCenter(ws: XLSX.WorkSheet, cellAddr: string) {
    const cell = ws[cellAddr]
    if (!cell) return

    cell.s = {
        ...(cell.s || {}),
        font: { bold: true },
        alignment: { horizontal: "center" },
    }
}

/* =========================
   Controller
========================= */
export async function exportLaporanTahunan(req: Request, res: Response) {
    const tahun = Number(req.query.tahun)
    if (!tahun) {
        return res.status(400).json({ message: "Parameter tahun wajib diisi" })
    }

    const neraca = await NeracaService.getNeraca(tahun)
    const shu = await SHUService.getSHUAllocation(tahun)

    const wb = XLSX.utils.book_new()

    /* =========================
       NERACA
    ========================= */
    const neracaSheet = XLSX.utils.aoa_to_sheet([
        [],
        [],
        ["", "AKTIVA", "", "", "PASIVA", ""],
        ["", "Kas", neraca.aktiva.kas, "", "Hutang Lancar", neraca.pasiva.hutangLancar],
        ["", "Piutang", neraca.aktiva.piutang, "", "Equity", neraca.pasiva.equity],
        ["", "Total Aktiva", neraca.aktiva.totalAktiva, "", "Total Pasiva", neraca.pasiva.totalPasiva],
    ])

    neracaSheet["!cols"] = [
        { wch: 3 },
        { wch: 22 },
        { wch: 18 },
        { wch: 4 },
        { wch: 22 },
        { wch: 18 },
    ]

    neracaSheet["!merges"] = [
        // AKTIVA (B3:C3)
        { s: { r: 2, c: 1 }, e: { r: 2, c: 2 } },

        // PASIVA (E3:F3)
        { s: { r: 2, c: 4 }, e: { r: 2, c: 5 } },
    ]


    setBoldCenter(neracaSheet, "B3")
    setBoldCenter(neracaSheet, "E3")

    addBorderRange(neracaSheet, "B3:C6")
    addBorderRange(neracaSheet, "E3:F6")

    XLSX.utils.book_append_sheet(wb, neracaSheet, "Neraca")

    /* =========================
       SHU
    ========================= */
    const shuSheet = XLSX.utils.aoa_to_sheet([
        [],
        [],
        ["", "Keterangan", "Jumlah"],
        ["", "Pendapatan", shu.pendapatan],
        ["", "Biaya", shu.biaya],
        ["", "SHU", shu.shu],
    ])

    shuSheet["!cols"] = [
        { wch: 3 },
        { wch: 26 },
        { wch: 18 },
    ]

    setBoldCenter(shuSheet, "B3")
    setBoldCenter(shuSheet, "C3")

    addBorderRange(shuSheet, "B3:C6")

    XLSX.utils.book_append_sheet(wb, shuSheet, "SHU")

    /* =========================
       LABA RUGI
    ========================= */
    const labaRugiSheet = XLSX.utils.aoa_to_sheet([
        [],
        [],
        ["", "Keterangan", "Jumlah"],
        ["", "Pendapatan", shu.pendapatan],
        ["", "Biaya", shu.biaya],
        ["", "Laba Bersih", shu.pendapatan - shu.biaya],
    ])

    labaRugiSheet["!cols"] = [
        { wch: 3 },
        { wch: 26 },
        { wch: 18 },
    ]

    setBoldCenter(labaRugiSheet, "B3")
    setBoldCenter(labaRugiSheet, "C3")

    addBorderRange(labaRugiSheet, "B3:C6")

    XLSX.utils.book_append_sheet(wb, labaRugiSheet, "Laba Rugi")

    /* =========================
       RESPONSE
    ========================= */
    const buffer = XLSX.write(wb, {
        type: "buffer",
        bookType: "xlsx",
        cellStyles: true,
    })

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=laporan-${tahun}.xlsx`
    )

    res.send(buffer)
}

"use client";

import { Download } from "lucide-react";
import Papa from "papaparse";

interface ExportButtonProps {
    data: any[];
    filename?: string;
}

export default function ExportButton({ data, filename = "export.csv" }: ExportButtonProps) {
    const handleExport = () => {
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
        >
            <Download className="w-4 h-4" />
            Export CSV
        </button>
    );
}

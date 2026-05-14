"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";

export type PeriodoTab = "DIARIO" | "SEMANAL" | "MENSUAL" | "ANUAL";

interface ReportFiltersProps {
  activeTab: PeriodoTab;
  onTabChange: (t: PeriodoTab) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (d: string) => void;
  onEndDateChange: (d: string) => void;
  onExport?: () => void;
}

export default function ReportFilters({
  activeTab,
  onTabChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onExport,
}: ReportFiltersProps) {
  const TABS: PeriodoTab[] = ["DIARIO", "SEMANAL", "MENSUAL", "ANUAL"];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-8 w-full">
      {/* Selector de periodos (Tabs) */}
      <div className="flex bg-white/80 backdrop-blur-sm border border-gray-200 p-1 rounded-xl w-full lg:w-auto overflow-x-auto hide-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 lg:flex-none px-3 sm:px-5 py-2.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab
                ? "bg-[#2d3748] text-white shadow-md"
                : "text-gray-500 hover:bg-gray-100/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Selectores de Fechas y Botón Excel */}
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <div className="flex gap-2 flex-1 sm:flex-none">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="flex-1 px-3 sm:px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 outline-none bg-white/80 cursor-pointer focus:border-[#b76e79] transition-colors"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="flex-1 px-3 sm:px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 outline-none bg-white/80 cursor-pointer focus:border-[#b76e79] transition-colors"
          />
        </div>

        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2d3748] hover:bg-black text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-lg shadow-black/10 w-full sm:w-auto"
          >
            <Download size={16} />
            Excel Contable
          </button>
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

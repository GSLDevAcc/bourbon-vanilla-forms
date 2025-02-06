// src/app/production-sheet/page.tsx
"use client";

import { Toaster } from "sonner";
import ProductionSheetForm from "@/components/production-sheet/production-sheet-form";

export default function ProductionSheetPage() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 py-8">
        <ProductionSheetForm />
      </div>
    </>
  );
}
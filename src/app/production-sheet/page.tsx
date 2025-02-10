// src/app/production-sheet/page.tsx


import { Toaster } from "sonner";
import ProductionSheetForm from "@/components/production-sheet/production-sheet-form";

export default function ProductionSheetPage() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="w-full max-w-7xl mx-auto px-2 pt-2">
        <ProductionSheetForm />
      </div>
    </>
  );
}
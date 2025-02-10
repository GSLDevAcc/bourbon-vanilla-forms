// src/components/production-release/production-release-form.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toleranceData } from "@/lib/toleranceData";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ProductionReleaseFormData, DEFAULT_PRODUCTION_RELEASE_STATE, Sample } from "@/lib/types";

interface ToleranceOption {
    value: number;
    label: string;
    color: string;
  }
  
  interface ToleranceDataItem {
    name: string;
    options: ToleranceOption[];
  }
  

export default function ProductionReleaseForm() {
  const [formData, setFormData] = useState<ProductionReleaseFormData>(DEFAULT_PRODUCTION_RELEASE_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSample, setCurrentSample] = useState({ rowIndex: 0, sampleIndex: 0 });

    // Initialize samples based on toleranceData length
    useEffect(() => {
      setFormData(prev => ({
        ...prev,
        samples: Array(toleranceData.length).fill(null).map(() => ({
          sample1: "",
          sample2: "",
          sample3: "",
          sample4: "",
          average: "",
          deviation: "",
          correctiveAction: ""
        }))
      }));
    }, []);
    
  
    const resetForm = () => {
      const initializedSamples = toleranceData.map(() => ({
        sample1: "",
        sample2: "",
        sample3: "",
        sample4: "",
        average: "",
        deviation: "",
        correctiveAction: ""
      }));
    
      setFormData({
        ...DEFAULT_PRODUCTION_RELEASE_STATE,
        samples: initializedSamples
      });
      setCurrentId(null);
      setSearchId("");
    };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast.error("Please enter a Production Release Order ID");
      return;
    }
  
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from("production_releases")
        .select("*")
        .eq("production_release_order", searchId.trim())
        .single();
  
      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          toast.error("No record found with this Production Release Order ID");
        } else {
          throw error;
        }
        return;
      }
  
      if (data) {
        setCurrentId(data.id);
        setFormData({
          productionReleaseOrder: data.production_release_order,
          productionDate: data.production_date,
          evaluationDate: data.evaluation_date,
          lotNumber: data.lot_number,
          productCode: data.product_code,
          samples: data.samples || DEFAULT_PRODUCTION_RELEASE_STATE.samples,
          canRelease: data.can_release,
          elaboratedBy: data.elaborated_by || "",
          elaboratedDate: data.elaborated_date || "",
          approvedBy: data.approved_by || "",
          approvedDate: data.approved_date || "",
        });
        toast.success("Form data loaded successfully");
      }
    } catch (error) {
      console.error("Error searching:", error);
      toast.error("Error loading form data");
    } finally {
      setIsSearching(false);
    }
  };

  // Update the handleSubmit function
  const getColorForValue = (value: string | number, rowIndex: number): string => {
    // Check if value is explicitly undefined, null, or empty string
    if (value === undefined || value === null || value === '') return "bg-gray-100";
    
    // Convert to number if it's a string
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    
    // Check if it's NaN after conversion
    if (isNaN(numValue)) return "bg-gray-100";
    
    // Find the matching option (including 0)
    const option = toleranceData[rowIndex]?.options.find(opt => opt.value === numValue);
    
    // Return the color or default
    return option?.color || "bg-gray-100";
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Basic validation
  if (!formData.productionReleaseOrder || !formData.lotNumber) {
    toast.error("Production Release Order and Lot Number are required");
    return;
  }

  if (!formData.productionDate || !formData.evaluationDate) {
    toast.error("Production Date and Evaluation Date are required");
    return;
  }

  setIsLoading(true);

  const formPayload = {
    production_release_order: formData.productionReleaseOrder,
    production_date: formData.productionDate,
    evaluation_date: formData.evaluationDate,
    lot_number: formData.lotNumber,
    product_code: formData.productCode,
    samples: formData.samples,
    can_release: formData.canRelease,
    elaborated_by: formData.elaboratedBy,
    elaborated_date: formData.elaboratedDate,
    approved_by: formData.approvedBy,
    approved_date: formData.approvedDate,
  };

  try {
    let error;
    
    if (currentId) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("production_releases")
        .update(formPayload)
        .eq("id", currentId);
      error = updateError;
    } else {
      // Check if record already exists
      const { data: existingRecord } = await supabase
        .from("production_releases")
        .select("id")
        .eq("production_release_order", formPayload.production_release_order)
        .single();

      if (existingRecord) {
        toast.error("A record with this Production Release Order already exists");
        setIsLoading(false);
        return;
      }

      // Insert new record
      const { error: insertError } = await supabase
        .from("production_releases")
        .insert([formPayload]);
      error = insertError;
    }

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        toast.error("A record with this Production Release Order or Lot Number already exists");
      } else {
        throw error;
      }
    } else {
      toast.success(currentId ? "Form updated successfully" : "Form submitted successfully");
      if (!currentId) {
        resetForm();
      }
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.error("Error submitting form");
  } finally {
    setIsLoading(false);
  }
};

  const handleToleranceSelect = (value: number) => {
    const { rowIndex, sampleIndex } = currentSample;
    const newSamples = [...formData.samples];
    const sampleKey = `sample${sampleIndex + 1}` as keyof Sample;
    
    newSamples[rowIndex] = {
      ...newSamples[rowIndex],
      [sampleKey]: value
    };

    // Calculate average
    const samples = [1, 2, 3, 4]
      .map(num => newSamples[rowIndex][`sample${num}` as keyof Sample])
      .filter(val => val !== '')
      .map(val => typeof val === 'string' ? parseFloat(val) : val);

    if (samples.length === 4) {
      const avg = samples.reduce((a, b) => Number(a) + Number(b), 0) / 4;
      newSamples[rowIndex].average = avg.toFixed(2);
    }

    setFormData(prev => ({
      ...prev,
      samples: newSamples
    }));
    setModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Search Section */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Enter Production Release Order ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
        <Button 
          onClick={handleSearch}
          disabled={isSearching}
          variant="outline"
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Form Title */}
      <div className="text-center border-b pb-4">
        <h1 className="text-2xl font-bold">Production Release Form</h1>
      </div>

      {/* Header Fields */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Production Release Order</label>
          <Input
            value={formData.productionReleaseOrder}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                productionReleaseOrder: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Production Date</label>
          <Input
            type="date"
            value={formData.productionDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                productionDate: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Evaluation Date</label>
          <Input
            type="date"
            value={formData.evaluationDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                evaluationDate: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lot Number</label>
          <Input
            value={formData.lotNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                lotNumber: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Product Code</label>
          <Input
            value={formData.productCode}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                productCode: e.target.value,
              }))
            }
          />
        </div>
      </div>

      {/* Samples Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-3 text-left">Parameter</th>
              <th className="border p-3 text-center">Sample 1</th>
              <th className="border p-3 text-center">Sample 2</th>
              <th className="border p-3 text-center">Sample 3</th>
              <th className="border p-3 text-center">Sample 4</th>
              <th className="border p-3 text-center">Average</th>
              <th className="border p-3 text-center">Deviation</th>
              <th className="border p-3 text-center">Corrective Action</th>
            </tr>
          </thead>
          <tbody>
  {toleranceData.map((category, rowIndex) => (
    <tr key={rowIndex} className="hover:bg-slate-50">
      <td className="border p-3">
        <div className="font-medium">{category.name}</div>
      </td>
     {/* Replace your existing sample cell rendering with this */}
{/* Replace the sample cells in your table */}
{[1, 2, 3, 4].map((sampleNum) => (
  <td key={sampleNum} className="border p-3">
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={() => {
          setCurrentSample({ rowIndex, sampleIndex: sampleNum - 1 });
          setModalOpen(true);
        }}
        className={`w-16 h-16 flex flex-col items-center justify-center 
          border rounded-lg shadow-sm cursor-pointer transition-all 
          hover:shadow-md ${
            formData.samples[rowIndex] 
              ? getColorForValue(formData.samples[rowIndex][`sample${sampleNum}` as keyof Sample], rowIndex)
              : "bg-gray-50 hover:bg-gray-100"
          }`}
      >
        {formData.samples[rowIndex]?.[`sample${sampleNum}` as keyof Sample] !== "" ? (
          <>
            <span className="text-2xl font-bold text-white">
              {formData.samples[rowIndex]?.[`sample${sampleNum}` as keyof Sample]}
            </span>
            <span className="text-xs text-white text-opacity-90 mt-1">
              {toleranceData[rowIndex]?.options.find(
                opt => opt.value === Number(formData.samples[rowIndex]?.[`sample${sampleNum}` as keyof Sample])
              )?.label.split('(')[0]}
            </span>
          </>
        ) : (
          <span className="text-gray-400 font-medium">Set</span>
        )}
      </div>
    </div>
  </td>
))}
      <td className="border p-3 text-center font-medium">
        {formData.samples[rowIndex]?.average || ''}
      </td>
      <td className="border p-3">
        <Input
          value={formData.samples[rowIndex]?.deviation || ''}
          onChange={(e) => {
            const newSamples = [...formData.samples];
            if (newSamples[rowIndex]) {
              newSamples[rowIndex].deviation = e.target.value;
              setFormData((prev) => ({ ...prev, samples: newSamples }));
            }
          }}
          className="w-full"
        />
      </td>
      <td className="border p-3">
        <Input
          value={formData.samples[rowIndex]?.correctiveAction || ''}
          onChange={(e) => {
            const newSamples = [...formData.samples];
            if (newSamples[rowIndex]) {
              newSamples[rowIndex].correctiveAction = e.target.value;
              setFormData((prev) => ({ ...prev, samples: newSamples }));
            }
          }}
          className="w-full"
        />
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

      {/* Release Checkbox */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="canRelease"
            checked={formData.canRelease}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                canRelease: e.target.checked,
              }))
            }
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="canRelease" className="text-sm font-medium">
            Can this lot be released?
          </label>
        </div>
      </div>

      {/* Approval Section */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Elaborated by:</label>
          <Input
            value={formData.elaboratedBy}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                elaboratedBy: e.target.value,
              }))
            }
          />
          <Input
            type="date"
            className="mt-2"
            value={formData.elaboratedDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                elaboratedDate: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Approved by:</label>
          <Input
            value={formData.approvedBy}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                approvedBy: e.target.value,
              }))
            }
          />
          <Input
            type="date"
            className="mt-2"
            value={formData.approvedDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                approvedDate: e.target.value,
              }))
            }
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={resetForm}>
          Clear Form
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Submitting..." : currentId ? "Update Form" : "Submit Form"}
        </Button>
      </div>


{/* Replace your existing Dialog section */}
<Dialog open={modalOpen} onOpenChange={setModalOpen}>
  <DialogContent className="bg-white p-0 sm:max-w-[425px]">
    <DialogHeader className="p-6 pb-2">
      <DialogTitle className="text-xl font-bold text-gray-900">
        {toleranceData[currentSample.rowIndex]?.name}
        <span className="ml-2 text-sm font-normal text-gray-500">
          (Sample {currentSample.sampleIndex + 1})
        </span>
      </DialogTitle>
    </DialogHeader>
    <div className="p-6 pt-2 grid gap-3">
      {toleranceData[currentSample.rowIndex]?.options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleToleranceSelect(option.value)}
          className={`w-full ${option.color} text-white rounded-lg transition-all 
            hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          <div className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-black bg-opacity-10 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold">{option.value}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">
                {option.label.split('(')[0].trim()}
              </span>
              {option.label.includes('(') && (
                <span className="text-sm opacity-90">
                  ({option.label.split('(')[1]}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  </DialogContent>
</Dialog>
    </div>
  );
}
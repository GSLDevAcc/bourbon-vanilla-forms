// src/components/volume-control/volume-control-form.tsx
"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import { VolumeControlFormData, DEFAULT_VOLUME_CONTROL_STATE } from '@/lib/types';

const VolumeControlForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [formData, setFormData] = useState<VolumeControlFormData>(DEFAULT_VOLUME_CONTROL_STATE);

  // First, let's define allowed fields for cylinder changes
  type CylinderField = 'ml100' | 'ml250' | 'ml1000' | 'conforming';

  const handleCylinderChange = (index: number, field: CylinderField, value: string) => {
    const newCylinders = [...formData.measuringCylinders];
    newCylinders[index] = { ...newCylinders[index], [field]: value };
    setFormData(prev => ({ ...prev, measuringCylinders: newCylinders }));
  };

  const handleMeasurementConformingChange = (rowIndex: number, value: string) => {
    const newMeasurements = [...formData.weightMeasurements];
    newMeasurements[rowIndex] = {
      ...newMeasurements[rowIndex],
      conforming: value
    };
    setFormData(prev => ({
      ...prev,
      weightMeasurements: newMeasurements
    }));
  };

  const handleSearch = async () => {
    if (!searchId) return;
    
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('volume_controls')
        .select('*')
        .eq('product_release_order', searchId)
        .single();

      if (error) throw error;

      if (data) {
        setCurrentId(data.id);
        setFormData({
          productReleaseOrder: data.product_release_order,
          date: data.date,
          productReference: data.product_reference,
          quantityProduced: data.quantity_produced,
          descriptionOfProduct: data.description_of_product,
          lotNumber: data.lot_number,
          client: data.client,
          alcoholContent: data.alcohol_content,
          acceptableWeightRange: data.acceptable_weight_range,
          measuringCylinders: data.measuring_cylinders,
          cylinderNonConforming: data.cylinder_non_conforming,
          weightMeasurements: data.weight_measurements,
          checkedBy: data.checked_by,
          checkedDate: data.checked_date,
          verifiedBy: data.verified_by,
          verifiedDate: data.verified_date
        });
        toast.success('Form data loaded successfully');
      }
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Error loading form data');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formPayload = {
      product_release_order: formData.productReleaseOrder,
      date: formData.date,
      product_reference: formData.productReference,
      quantity_produced: formData.quantityProduced,
      description_of_product: formData.descriptionOfProduct,
      lot_number: formData.lotNumber,
      client: formData.client,
      alcohol_content: formData.alcoholContent,
      acceptable_weight_range: formData.acceptableWeightRange,
      measuring_cylinders: formData.measuringCylinders,
      cylinder_non_conforming: formData.cylinderNonConforming,
      weight_measurements: formData.weightMeasurements,
      checked_by: formData.checkedBy,
      checked_date: formData.checkedDate,
      verified_by: formData.verifiedBy,
      verified_date: formData.verifiedDate
    };

    try {
      let error;
      
      if (currentId) {
        const { error: updateError } = await supabase
          .from('volume_controls')
          .update(formPayload)
          .eq('id', currentId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('volume_controls')
          .insert([formPayload]);
        error = insertError;
      }

      if (error) throw error;
      toast.success(currentId ? 'Form updated successfully' : 'Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentId(null);
    setSearchId('');
    setFormData(DEFAULT_VOLUME_CONTROL_STATE);
  };

  const handleWeightChange = (rowIndex: number, colIndex: number, value: string) => {
    const newMeasurements = [...formData.weightMeasurements];
    const weights = [...(newMeasurements[rowIndex]?.weights || [])];
    weights[colIndex] = value;
    
    // Calculate average if weights are filled
    const filledWeights = weights.filter(w => w !== '');
    const average = filledWeights.length > 0 
      ? (filledWeights.reduce((sum, weight) => sum + parseFloat(weight || '0'), 0) / filledWeights.length).toFixed(2)
      : '';

    newMeasurements[rowIndex] = {
      ...newMeasurements[rowIndex],
      weights,
      average
    };

    setFormData(prev => ({ ...prev, weightMeasurements: newMeasurements }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow">
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
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <div className="text-center border-b pb-4">
        <h1 className="text-2xl font-bold">VOLUME CONTROL SHEET</h1>
      </div>

      {/* Header Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Release Order</label>
          <Input 
            value={formData.productReleaseOrder}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              productReleaseOrder: e.target.value
            }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Input 
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              date: e.target.value
            }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Product Reference</label>
          <Input 
            value={formData.productReference}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              productReference: e.target.value
            }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantity Produced</label>
          <Input 
            value={formData.quantityProduced}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              quantityProduced: e.target.value
            }))}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description of Product</label>
          <Input 
            value={formData.descriptionOfProduct}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              descriptionOfProduct: e.target.value
            }))}
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Lot Number</label>
          <Input
            value={formData.lotNumber}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              lotNumber: e.target.value
            }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Client</label>
          <Input
            value={formData.client}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              client: e.target.value
            }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Alcohol Content</label>
          <Input
            value={formData.alcoholContent}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              alcoholContent: e.target.value
            }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Acceptable Weight Range</label>
          <Input
            value={formData.acceptableWeightRange}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              acceptableWeightRange: e.target.value
            }))}
          />
        </div>
      </div>

      {/* Measuring Cylinders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2">MEASURING CYLINDER REFERENCE</th>
              <th className="border p-2">100ML</th>
              <th className="border p-2">250ML</th>
              <th className="border p-2">1000ML</th>
              <th className="border p-2">Maximum permissible error</th>
              <th className="border p-2">Conform Yes/No</th>
            </tr>
          </thead>
          <tbody>
            {formData.measuringCylinders.map((cylinder, index) => (
              <tr key={index}>
                <td className="border p-2">{cylinder.type}</td>
                <td className="border p-2">
                  <Input
                    value={cylinder.ml100}
                    onChange={(e) => handleCylinderChange(index, 'ml100', e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <Input
                    value={cylinder.ml250}
                    onChange={(e) => handleCylinderChange(index, 'ml250', e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <Input
                    value={cylinder.ml1000}
                    onChange={(e) => handleCylinderChange(index, 'ml1000', e.target.value)}
                  />
                </td>
                <td className="border p-2">{cylinder.maxPermissibleError}</td>
                <td className="border p-2">
                  <select
                    value={cylinder.conforming}
                    onChange={(e) => handleCylinderChange(index, 'conforming', e.target.value)}
                    className="w-[100px] h-10 rounded-md border border-slate-200 bg-white px-3"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Non-Conforming Alert Section */}
      <div className="bg-yellow-50 border-2 border-yellow-200 p-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">IF MEASURING CYLINDER IS NON CONFORMING HAS IT BEEN REMOVED FROM PRODUCTION</span>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="cylinderNonConforming"
                checked={formData.cylinderNonConforming === true}
                onChange={() => setFormData(prev => ({
                  ...prev,
                  cylinderNonConforming: true
                }))}
                className="form-radio"
              />
              <span>YES</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="cylinderNonConforming"
                checked={formData.cylinderNonConforming === false}
                onChange={() => setFormData(prev => ({
                  ...prev,
                  cylinderNonConforming: false
                }))}
                className="form-radio"
              />
              <span>NO</span>
            </label>
          </div>
        </div>
      </div>

      {/* Weight Measurements Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2">TIME</th>
              <th className="border p-2 text-center" colSpan={6}>WEIGHT OF PRODUCT</th>
              <th className="border p-2">AVERAGE</th>
              <th className="border p-2">CONFORMING</th>
            </tr>
          </thead>
          <tbody>
            {formData.weightMeasurements.map((measurement, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border p-2">
                  <Input
                    type="time"
                    value={measurement.time}
                    onChange={(e) => {
                      const newMeasurements = [...formData.weightMeasurements];
                      newMeasurements[rowIndex] = {
                        ...newMeasurements[rowIndex],
                        time: e.target.value
                      };
                      setFormData(prev => ({
                        ...prev,
                        weightMeasurements: newMeasurements
                      }));
                    }}
                  />
                </td>
                {measurement.weights.map((weight, colIndex) => (
                  <td key={colIndex} className="border p-2">
                    <Input
                      type="text"
                      value={weight}
                      onChange={(e) => handleWeightChange(rowIndex, colIndex, e.target.value)}
                    />
                  </td>
                ))}
                <td className="border p-2 text-center">{measurement.average}</td>
                <td className="border p-2">
                  <select
                    value={measurement.conforming}
                    onChange={(e) => {
                      const newMeasurements = [...formData.weightMeasurements];
                      newMeasurements[rowIndex] = {
                        ...newMeasurements[rowIndex],
                        conforming: e.target.value
                      };
                      setFormData(prev => ({
                        ...prev,
                        weightMeasurements: newMeasurements
                      }));
                    }}
                    className="w-[100px] h-10 rounded-md border border-slate-200 bg-white px-3"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer - Approval Section */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Checked by</label>
          <Input
            value={formData.checkedBy}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              checkedBy: e.target.value
            }))}
          />
          <Input
            type="date"
            value={formData.checkedDate}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              checkedDate: e.target.value
            }))}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Verified by</label>
          <Input
            value={formData.verifiedBy}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              verifiedBy: e.target.value
            }))}
          />
          <Input
            type="date"
            value={formData.verifiedDate}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              verifiedDate: e.target.value
            }))}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <Button 
          variant="outline"
          onClick={handleReset}
        >
          Clear Form
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : currentId ? 'Update Form' : 'Submit Form'}
        </Button>
      </div>
    </div>
  );
};

export default VolumeControlForm;
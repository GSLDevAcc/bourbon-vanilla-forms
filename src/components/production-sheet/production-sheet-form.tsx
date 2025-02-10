// src/components/production-sheet/production-sheet-form.tsx
"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import { 
  FormState, 
  DEFAULT_FORM_STATE, 
  ProcessStep, 
  InspectionItem,
  ProductionStep,
  ControlItem,
  RawMaterial 
} from '@/lib/types';

const ProductionSheetForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>(DEFAULT_FORM_STATE);

  // Form Handlers
  const handleProcessStepChange = (field: keyof ProcessStep, value: string) => {
    setFormData(prev => ({
      ...prev,
      process_steps: {
        ...prev.process_steps,
        [field]: value
      }
    }));
  };

  const handleInspectionItemChange = (index: number, field: keyof InspectionItem, value: any) => {
    setFormData(prev => {
      const newItems = [...prev.inspection_items];
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
      return {
        ...prev,
        inspection_items: newItems
      };
    });
  };

  // Add these functions to your ProductionSheetForm component

const validateRequiredFields = (formData: FormState): string[] => {
  const errors: string[] = [];

  // Required field validation
  if (!formData.productReleaseOrder) errors.push('Product Release Order is required');
  if (!formData.productReference) errors.push('Product Reference is required');
  if (!formData.descriptionOfProduct) errors.push('Description of Product is required');
  if (!formData.lotNumber) errors.push('Lot Number is required');
  if (!formData.date) errors.push('Date is required');
  if (!formData.quantityProduced) errors.push('Quantity Produced is required');

  // Validate process steps
  if (!formData.process_steps.date) errors.push('Process Step Date is required');
  if (!formData.process_steps.time) errors.push('Process Step Time is required');
  if (!formData.process_steps.outflowFromStock) errors.push('Outflow From Stock is required');
  if (!formData.process_steps.weigh) errors.push('Weigh is required');
  if (!formData.process_steps.mixing) errors.push('Mixing is required');
  if (!formData.process_steps.storekeeper) errors.push('Storekeeper is required');

  // Validate inspection items
  formData.inspection_items.forEach((item, index) => {
    if (!item.answer) errors.push(`Inspection item ${index + 1} answer is required`);
  });

  // Validate at least one production step
  const hasProductionStep = formData.production_steps.some(step => 
    step.personPerforming || step.packagingCheck || step.podPlacement
  );
  if (!hasProductionStep) errors.push('At least one production step is required');

  // Validate control items
  formData.control_items.forEach((item, index) => {
    if (!item.conform && !item.nonConform) {
      errors.push(`Control item "${item.verification}" requires a conformity check`);
    }
  });

  return errors;
};

const validateFormBeforeSubmit = (formData: FormState): boolean => {
  const errors = validateRequiredFields(formData);
  
  if (errors.length > 0) {
    // Show all validation errors
    errors.forEach(error => toast.error(error));
    return false;
  }
  
  return true;
};

  const handleFilteringChange = (field: keyof FormState['filtering'], value: string) => {
    setFormData(prev => ({
      ...prev,
      filtering: {
        ...prev.filtering,
        [field]: value
      }
    }));
  };

  const handleSievingChange = (field: keyof FormState['sieving'], value: string) => {
    setFormData(prev => ({
      ...prev,
      sieving: {
        ...prev.sieving,
        [field]: value
      }
    }));
  };

  const handleBottleClosureChange = (field: keyof FormState['bottle_closure'], value: string) => {
    setFormData(prev => ({
      ...prev,
      bottle_closure: {
        ...prev.bottle_closure,
        [field]: value
      }
    }));
  };

  const handleProductionStepChange = (index: number, field: keyof ProductionStep, value: string) => {
    setFormData(prev => {
      const newSteps = [...prev.production_steps];
      newSteps[index] = {
        ...newSteps[index],
        [field]: value
      };
      return {
        ...prev,
        production_steps: newSteps
      };
    });
  };

  const handleControlItemChange = (index: number, field: keyof ControlItem, value: any) => {
    setFormData(prev => {
      const newItems = [...prev.control_items];
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
      return {
        ...prev,
        control_items: newItems
      };
    });
  };

  const handleGlassBreakageChange = (field: keyof FormState['glass_breakage'], value: any) => {
    setFormData(prev => ({
      ...prev,
      glass_breakage: {
        ...prev.glass_breakage,
        [field]: value
      }
    }));
  };

  const resetForm = () => {
    if (window.confirm('Are you sure you want to clear the form? All unsaved changes will be lost.')) {
      setFormData(DEFAULT_FORM_STATE);
      setCurrentId(null);
      setSearchId('');
      toast.success('Form cleared');
    }
  };

  const handleRawMaterialChange = (index: number, field: keyof RawMaterial, value: string) => {
    setFormData(prev => {
      const newMaterials = [...prev.raw_materials];
      newMaterials[index] = {
        ...newMaterials[index],
        [field]: value
      };
      return {
        ...prev,
        raw_materials: newMaterials
      };
    });
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast.error('Please enter a Production Release Order ID');
      return;
    }
  
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('production_sheets')
        .select('*')
        .eq('product_release_order', searchId.trim())
        .single();
  
      if (error) {
        if (error.code === 'PGRST116') {
          toast.error('No production sheet found with this ID');
          return;
        }
        throw error;
      }
  
      if (data) {
        setCurrentId(data.id);
        setFormData({
          productReleaseOrder: data.product_release_order,
          productReference: data.product_reference,
          descriptionOfProduct: data.description_of_product,
          lotNumber: data.lot_number,
          date: data.date,
          quantityProduced: data.quantity_produced,
          filledBy: data.filled_by,
          filledDate: data.filled_date,
          approvedBy: data.approved_by,
          approvedDate: data.approved_date,
          raw_materials: data.raw_materials || DEFAULT_FORM_STATE.raw_materials,
          process_steps: data.process_steps,
          inspection_items: data.inspection_items,
          filtering: data.filtering,
          sieving: data.sieving,
          bottle_closure: data.bottle_closure,
          production_steps: data.production_steps,
          control_items: data.control_items,
          glass_breakage: data.glass_breakage
        });
        toast.success('Production sheet loaded successfully');
      }
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Error loading production sheet');
    } finally {
      setIsSearching(false);
    }
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate form before submission
  if (!validateFormBeforeSubmit(formData)) {
    return;
  }

  setIsLoading(true);

  const formPayload = {
    product_release_order: formData.productReleaseOrder,
    product_reference: formData.productReference,
    description_of_product: formData.descriptionOfProduct,
    lot_number: formData.lotNumber,
    date: formData.date,
    quantity_produced: formData.quantityProduced,
    filled_by: formData.filledBy,
    filled_date: formData.filledDate,
    approved_by: formData.approvedBy,
    approved_date: formData.approvedDate,
    raw_materials: formData.raw_materials,
    process_steps: formData.process_steps,
    inspection_items: formData.inspection_items,
    filtering: formData.filtering,
    sieving: formData.sieving,
    bottle_closure: formData.bottle_closure,
    production_steps: formData.production_steps,
    control_items: formData.control_items,
    glass_breakage: formData.glass_breakage
  };

  try {
    let error;
    
    if (currentId) {
      const { error: updateError } = await supabase
        .from('production_sheets')
        .update(formPayload)
        .eq('id', currentId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('production_sheets')
        .insert([formPayload]);
      error = insertError;
    }

    if (error) {
      if (error.code === '23505') {
        if (error.message.includes('product_release_order')) {
          toast.error('A production sheet with this Release Order already exists');
        } else if (error.message.includes('lot_number')) {
          toast.error('A production sheet with this Lot Number already exists');
        } else {
          toast.error('A duplicate record already exists');
        }
        return;
      }
      throw error;
    }

    toast.success(currentId ? 'Production sheet updated successfully' : 'Production sheet submitted successfully');
    
    if (!currentId) {
      resetForm();
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    toast.error('Error submitting production sheet');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-7xl mx-auto p-4">
      {/* Search Section */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Enter Production Release Order ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          variant="outline"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Header Section */}
      <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow">
        <div className="col-span-2 flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Production Sheet for Vanilla Extracts with Seeds(CCP)</h2>
          <div className="text-sm text-gray-500">
            <div>Form No: EV/PROD/009</div>
            <div>Revision: 5</div>
          </div>
        </div>

        {/* Base Form Fields */}
        <div>
          <Label>Product Release Order</Label>
          <Input
            value={formData.productReleaseOrder}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              productReleaseOrder: e.target.value
            }))}
          />
        </div>

        <div>
          <Label>Date</Label>
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
          <Label>Product Reference</Label>
          <Input
            value={formData.productReference}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              productReference: e.target.value
            }))}
          />
        </div>

        <div>
          <Label>Quantity Produced</Label>
          <Input
            value={formData.quantityProduced}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              quantityProduced: e.target.value
            }))}
          />
        </div>

        <div className="col-span-2">
          <Label>Description of Product</Label>
          <Input
            value={formData.descriptionOfProduct}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              descriptionOfProduct: e.target.value
            }))}
          />
        </div>

        <div className="col-span-2">
          <Label>Lot Number</Label>
          <Input
            value={formData.lotNumber}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              lotNumber: e.target.value
            }))}
          />
        </div>
      </div>

            {/* Raw Materials Section */}
<div className="bg-white p-6 rounded-lg shadow">
  <h3 className="text-lg font-semibold mb-4">Raw Materials</h3>
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Material</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>PO Number</TableHead>
          <TableHead>Delivery Date</TableHead>
          <TableHead>Quantity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {formData.raw_materials.map((material, index) => (
          <TableRow key={index}>
            <TableCell>
              <Input
                type="text"
                value={material.material}
                onChange={(e) => handleRawMaterialChange(index, 'material', e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                value={material.supplier}
                onChange={(e) => handleRawMaterialChange(index, 'supplier', e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                value={material.poNumber}
                onChange={(e) => handleRawMaterialChange(index, 'poNumber', e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Input
                type="date"
                value={material.deliveryDate}
                onChange={(e) => handleRawMaterialChange(index, 'deliveryDate', e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                value={material.quantity}
                onChange={(e) => handleRawMaterialChange(index, 'quantity', e.target.value)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</div>

      {/* Process Steps */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Process Steps</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DATE</TableHead>
                <TableHead>TIME</TableHead>
                <TableHead>OUTFLOW FROM STOCK</TableHead>
                <TableHead>WEIGH</TableHead>
                <TableHead>MIXING</TableHead>
                <TableHead>STOREKEEPER</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Input
                    type="date"
                    value={formData.process_steps.date}
                    onChange={(e) => handleProcessStepChange('date', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="time"
                    value={formData.process_steps.time}
                    onChange={(e) => handleProcessStepChange('time', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={formData.process_steps.outflowFromStock}
                    onChange={(e) => handleProcessStepChange('outflowFromStock', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={formData.process_steps.weigh}
                    onChange={(e) => handleProcessStepChange('weigh', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={formData.process_steps.mixing}
                    onChange={(e) => handleProcessStepChange('mixing', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={formData.process_steps.storekeeper}
                    onChange={(e) => handleProcessStepChange('storekeeper', e.target.value)}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Inspection of Vanilla */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Inspection of Vanilla</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>YES</TableHead>
                <TableHead>NO</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Corrective Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.inspection_items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.question}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={item.answer === 'YES'}
                      onCheckedChange={(checked) => {
                        handleInspectionItemChange(index, 'answer', checked ? 'YES' : '');
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={item.answer === 'NO'}
                      onCheckedChange={(checked) => {
                        handleInspectionItemChange(index, 'answer', checked ? 'NO' : '');
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.description}
                      onChange={(e) => handleInspectionItemChange(index, 'description', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.correctiveAction}
                      onChange={(e) => handleInspectionItemChange(index, 'correctiveAction', e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Filtering section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Filtering of extract CCP</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Has extract been filtered?/By whom?</Label>
            <Input
              type="text"
              value={formData.filtering.byWhom}
              onChange={(e) => handleFilteringChange('byWhom', e.target.value)}
            />
          </div>
          <div>
            <Label>Filter identification</Label>
            <Input
              type="text"
              value={formData.filtering.filterIdentification}
              onChange={(e) => handleFilteringChange('filterIdentification', e.target.value)}
            />
          </div>
          <div>
            <Label>Time started</Label>
            <Input
              type="time"
              value={formData.filtering.timeStarted}
              onChange={(e) => handleFilteringChange('timeStarted', e.target.value)}
            />
          </div>
          <div>
            <Label>Time ended</Label>
            <Input
              type="time"
              value={formData.filtering.timeEnded}
              onChange={(e) => handleFilteringChange('timeEnded', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Production Steps */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Production</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Person performing</TableHead>
                <TableHead>Packaging check</TableHead>
                <TableHead>Pod placement</TableHead>
                <TableHead>Extract filled</TableHead>
                <TableHead>Product level</TableHead>
                <TableHead>Bottles rinsed</TableHead>
                <TableHead>Label stamped</TableHead>
                <TableHead>Proof seal</TableHead>
                <TableHead>Product labeled</TableHead>
                <TableHead>Carton placement</TableHead>
                <TableHead>Shrink plastic</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.production_steps.map((step, index) => (
                <TableRow key={index}>
                  {Object.keys(step).map((key) => (
                    <TableCell key={key}>
                      <Input
                        type="text"
                        value={step[key as keyof ProductionStep]}
                        onChange={(e) => handleProductionStepChange(index, key as keyof ProductionStep, e.target.value)}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Control During Production */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Control During Production</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Verification</TableHead>
                <TableHead>Conform</TableHead>
                <TableHead>Non Conform</TableHead>
                <TableHead>Description of NC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.control_items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.verification}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={item.conform}
                      onCheckedChange={(checked) => {
                        handleControlItemChange(index, 'conform', checked);
                        if (checked) {
                          handleControlItemChange(index, 'nonConform', false);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={item.nonConform}
                      onCheckedChange={(checked) => {
                        handleControlItemChange(index, 'nonConform', checked);
                        if (checked) {
                          handleControlItemChange(index, 'conform', false);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleControlItemChange(index, 'description', e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

     {/* Glass Breakage Section */}
     <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Any Glass Breakage During Production</h3>
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-4">
            <RadioGroup
              value={formData.glass_breakage.occurred ? "yes" : "no"}
              defaultValue="no"
              onValueChange={(value: string) => 
                handleGlassBreakageChange('occurred', value === "yes")
              }
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="glass-yes" />
                  <Label htmlFor="glass-yes">YES</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="glass-no" />
                  <Label htmlFor="glass-no">NO</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label>Quantity</Label>
            <Input
              type="text"
              value={formData.glass_breakage.quantity}
              onChange={(e) => handleGlassBreakageChange('quantity', e.target.value)}
              disabled={!formData.glass_breakage.occurred}
            />
          </div>
        </div>
      </div>

      {/* Sieving Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Sieving of seeds CCP</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Sieve condition</Label>
            <Input
              type="text"
              value={formData.sieving.sieveCondition}
              onChange={(e) => handleSievingChange('sieveCondition', e.target.value)}
            />
          </div>
          <div>
            <Label>Sieve identification</Label>
            <Input
              type="text"
              value={formData.sieving.sieveIdentification}
              onChange={(e) => handleSievingChange('sieveIdentification', e.target.value)}
            />
          </div>
          <div>
            <Label>Time started</Label>
            <Input
              type="time"
              value={formData.sieving.timeStarted}
              onChange={(e) => handleSievingChange('timeStarted', e.target.value)}
            />
          </div>
          <div>
            <Label>Time ended</Label>
            <Input
              type="time"
              value={formData.sieving.timeEnded}
              onChange={(e) => handleSievingChange('timeEnded', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bottle Closure Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Verification of Bottle closure</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Time closure started</Label>
            <Input
              type="time"
              value={formData.bottle_closure.timeClosureStarted}
              onChange={(e) => handleBottleClosureChange('timeClosureStarted', e.target.value)}
            />
          </div>
          <div>
            <Label>Time Closure Ended</Label>
            <Input
              type="time"
              value={formData.bottle_closure.timeClosureEnded}
              onChange={(e) => handleBottleClosureChange('timeClosureEnded', e.target.value)}
            />
          </div>
          <div>
            <Label>Time check started</Label>
            <Input
              type="time"
              value={formData.bottle_closure.timeCheckStarted}
              onChange={(e) => handleBottleClosureChange('timeCheckStarted', e.target.value)}
            />
          </div>
          <div>
            <Label>Time check Ended</Label>
            <Input
              type="time"
              value={formData.bottle_closure.timeCheckEnded}
              onChange={(e) => handleBottleClosureChange('timeCheckEnded', e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <Label>Checked By</Label>
            <Input
              type="text"
              value={formData.bottle_closure.checkedBy}
              onChange={(e) => handleBottleClosureChange('checkedBy', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Approval Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <Label>Filled by:</Label>
            <Input
              type="text"
              value={formData.filledBy}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                filledBy: e.target.value
              }))}
            />
            <Label>Date:</Label>
            <Input
              type="date"
              value={formData.filledDate}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                filledDate: e.target.value
              }))}
            />
          </div>
          <div className="space-y-4">
            <Label>Approved By:</Label>
            <Input
              type="text"
              value={formData.approvedBy}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                approvedBy: e.target.value
              }))}
            />
            <Label>Date:</Label>
            <Input
              type="date"
              value={formData.approvedDate}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                approvedDate: e.target.value
              }))}
            />
          </div>
        </div>
      </div>

      {/* Submit and Clear Form Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <Button 
          type="button"
          variant="outline" 
          onClick={resetForm}
        >
          Clear Form
        </Button>
        <Button 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : currentId ? 'Update Form' : 'Submit Form'}
        </Button>
      </div>
    </form>
  );
};

export default ProductionSheetForm;
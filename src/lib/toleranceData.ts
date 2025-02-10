// src/lib/toleranceData.ts

// Types for type safety
export interface ToleranceOption {
  value: number;
  label: string;
  color: string;
}

export interface ToleranceCategory {
  id: number;
  name: string;
  options: ToleranceOption[];
}

// Tolerance data
export const toleranceData: ToleranceCategory[] = [
  {
    id: 1,
    name: "Vanilla extract with seeds colour",
    options: [
      { value: 4, label: "Very good (dark brown liquid)", color: "bg-amber-800" },
      { value: 3, label: "Good (brown liquid)", color: "bg-amber-600" },
      { value: 2, label: "Fair (pale brown liquid)", color: "bg-amber-500" },
      { value: 1, label: "Poor (yellowish brown liquid)", color: "bg-amber-400" },
      { value: 0, label: "Fail (any other color than brown)", color: "bg-red-500" }
    ]
  },
  {
    id: 2,
    name: "Vanilla extract with seeds taste",
    options: [
      { value: 4, label: "Very good (sweet taste with full taste of vanilla extract)", color: "bg-green-600" },
      { value: 3, label: "Good (sweet taste with mild taste of vanilla extract)", color: "bg-green-500" },
      { value: 2, label: "Fair (sweet taste with slight vanilla taste)", color: "bg-green-400" },
      { value: 1, label: "Poor (sweet taste with slight off taste)", color: "bg-yellow-500" },
      { value: 0, label: "Fail (no sweet taste with clear off taste)", color: "bg-red-500" }
    ]
  },
  {
    id: 3,
    name: "Vanilla extract with seeds weight",
    options: [
      { value: 4, label: "Very good (110g)", color: "bg-blue-600" },
      { value: 3, label: "Good (108g)", color: "bg-blue-500" },
      { value: 2, label: "Fair (105g)", color: "bg-blue-400" },
      { value: 1, label: "Poor (100g/105g)", color: "bg-yellow-500" },
      { value: 0, label: "Fail (50g/150g)", color: "bg-red-500" }
    ]
  },
  {
    id: 4,
    name: "Is there any odour of fermentation?",
    options: [
      { value: 4, label: "Very good (typical smell vanilla extract)", color: "bg-purple-600" },
      { value: 3, label: "Good (mild smell of vanilla extract)", color: "bg-purple-500" },
      { value: 2, label: "Fair (slight off smell)", color: "bg-purple-400" },
      { value: 1, label: "Poor (slight fermented smell)", color: "bg-yellow-500" },
      { value: 0, label: "Fail (smell of fermentation)", color: "bg-red-500" }
    ]
  },
  {
    id: 5,
    name: "Presence of foreign bodies",
    options: [
      { value: 4, label: "Very good (zero presence)", color: "bg-indigo-600" },
      { value: 3, label: "Good (presence of vanilla rope pieces)", color: "bg-indigo-500" },
      { value: 2, label: "Fair (presence of vanilla rope/raffia)", color: "bg-indigo-400" },
      { value: 1, label: "Poor (presence of material other than vanilla)", color: "bg-yellow-500" },
      { value: 0, label: "Fail (presence of metal/plastic/glass/metal/wood)", color: "bg-red-500" }
    ]
  },
  {
    id: 6,
    name: "Is bottle correctly sealed",
    options: [
      { value: 4, label: "Very good (no gaps/product tight)", color: "bg-teal-600" },
      { value: 3, label: "Good (tight gap with no impact on product)", color: "bg-teal-500" },
      { value: 2, label: "Fair (gap can be seen but product does not move)", color: "bg-teal-400" },
      { value: 1, label: "Poor (gap can be seen but extract moving)", color: "bg-yellow-500" },
      { value: 0, label: "Fail (product leaking)", color: "bg-red-500" }
    ]
  },
  {
    id: 7,
    name: "Is the labelling correct?",
    options: [
      { value: 4, label: "Very good (label straight)", color: "bg-pink-600" },
      { value: 3, label: "Good (1-3mm difference)", color: "bg-pink-500" },
      { value: 2, label: "Fair (3mm difference)", color: "bg-pink-400" },
      { value: 1, label: "Poor (3-4mm difference)", color: "bg-yellow-500" },
      { value: 0, label: "Fail (5 mm difference)", color: "bg-red-500" }
    ]
  },
  {
    id: 8,
    name: "Is the stamping conform:",
    options: [
      { value: 4, label: "Very good (clear and neat)", color: "bg-cyan-600" },
      { value: 3, label: "Good (clear but with slight misalignment)", color: "bg-cyan-500" },
      { value: 2, label: "Fair (not clear but can be read)", color: "bg-cyan-400" },
      { value: 1, label: "Poor (stamping on barcode)", color: "bg-yellow-500" },
      { value: 0, label: "Fail (mistake in dates)", color: "bg-red-500" }
    ]
  }
];

// Helper function to get a color class based on value and category
export const getToleranceColor = (value: number, categoryId: number): string => {
  const category = toleranceData.find(cat => cat.id === categoryId);
  const option = category?.options.find(opt => opt.value === value);
  return option?.color || 'bg-gray-100';
};

// Helper function to get label by value
export const getToleranceLabel = (value: number, categoryId: number): string => {
  const category = toleranceData.find(cat => cat.id === categoryId);
  const option = category?.options.find(opt => opt.value === value);
  return option?.label || '';
};

// Helper function to get short label (without description in parentheses)
export const getToleranceShortLabel = (value: number, categoryId: number): string => {
  const label = getToleranceLabel(value, categoryId);
  return label.split('(')[0].trim();
};
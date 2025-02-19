// src/lib/types.ts
// src/lib/types.ts

// Shared Interfaces
export interface RawMaterial {
  material: string;
  supplier: string;
  poNumber: string;
  deliveryDate: string;
  quantity: string;
}

export interface ProcessStep {
  date: string;
  time: string;
  outflowFromStock: string;
  weigh: string;
  mixing: string;
  storekeeper: string;
}

export interface InspectionItem {
  question: string;
  answer: 'YES' | 'NO' | '';
  description: string;
  correctiveAction: string;
}

export interface ProductionStep {
  personPerforming: string;
  packagingCheck: string;
  podPlacement: string;
  extractFilled: string;
  productLevel: string;
  bottlesRinsed: string;
  labelStamped: string;
  proofSeal: string;
  productLabeled: string;
  cartonPlacement: string;
  shrinkPlastic: string;
}

export interface ControlItem {
  verification: string;
  conform: boolean;
  nonConform: boolean;
  description: string;
}

// Production Sheet Form (Original)
export interface FormState {
  productReleaseOrder: string;
  productReference: string;
  descriptionOfProduct: string;
  lotNumber: string;
  date: string;
  quantityProduced: string;
  filledBy: string;
  filledDate: string;
  approvedBy: string;
  approvedDate: string;
  raw_materials: RawMaterial[];
  process_steps: ProcessStep;
  inspection_items: InspectionItem[];
  filtering: {
    hasBeenFiltered: string;
    byWhom: string;
    filterCondition: string;
    filterIdentification: string;
    timeStarted: string;
    timeEnded: string;
  };
  sieving: {
    sieveCondition: string;
    sieveIdentification: string;
    timeStarted: string;
    timeEnded: string;
  };
  bottle_closure: {
    timeClosureStarted: string;
    timeClosureEnded: string;
    timeCheckStarted: string;
    timeCheckEnded: string;
    checkedBy: string;
  };
  production_steps: ProductionStep[];
  control_items: ControlItem[];
  glass_breakage: {
    occurred: boolean;
    quantity: string;
  };
}

// Volume Control Types
export interface MeasuringCylinder {
  type: string;
  ml100: string;
  ml250: string;
  ml1000: string;
  maxPermissibleError: string;
  conforming: string;
}

export interface WeightMeasurement {
  time: string;
  weights: string[];
  average: string;
  conforming: string;
}

export interface VolumeControlFormData {
  productReleaseOrder: string;
  date: string;
  productReference: string;
  quantityProduced: string;
  descriptionOfProduct: string;
  lotNumber: string;
  client: string;
  alcoholContent: string;
  acceptableWeightRange: string;
  measuringCylinders: MeasuringCylinder[];
  cylinderNonConforming: boolean;
  weightMeasurements: WeightMeasurement[];
  checkedBy: string;
  checkedDate: string;
  verifiedBy: string;
  verifiedDate: string;
}

// Default States
export const DEFAULT_FORM_STATE: FormState = {
  productReleaseOrder: '',
  productReference: '',
  descriptionOfProduct: '',
  lotNumber: '',
  date: '',
  quantityProduced: '',
  filledBy: '',
  filledDate: '',
  approvedBy: '',
  approvedDate: '',
  raw_materials: Array(1).fill({
    material: '',
    supplier: '',
    poNumber: '',
    deliveryDate: '',
    quantity: ''
  }),
  process_steps: {
    date: '',
    time: '',
    outflowFromStock: '',
    weigh: '',
    mixing: '',
    storekeeper: ''
  },
  inspection_items: [
    {
      question: 'Is there any off smell of phenol ?',
      answer: '',
      description: '',
      correctiveAction: ''
    },
    {
      question: 'Is there presence of yeasts and moulds CCP?',
      answer: '',
      description: '',
      correctiveAction: ''
    },
    {
      question: 'Is there presence of foreign contaminants?',
      answer: '',
      description: '',
      correctiveAction: ''
    }
  ],
  filtering: {
    hasBeenFiltered: '',
    byWhom: '',
    filterCondition: '',
    filterIdentification: '',
    timeStarted: '',
    timeEnded: ''
  },
  sieving: {
    sieveCondition: '',
    sieveIdentification: '',
    timeStarted: '',
    timeEnded: ''
  },
  bottle_closure: {
    timeClosureStarted: '',
    timeClosureEnded: '',
    timeCheckStarted: '',
    timeCheckEnded: '',
    checkedBy: ''
  },
  production_steps: Array(5).fill({
    personPerforming: '',
    packagingCheck: '',
    podPlacement: '',
    extractFilled: '',
    productLevel: '',
    bottlesRinsed: '',
    labelStamped: '',
    proofSeal: '',
    productLabeled: '',
    cartonPlacement: '',
    shrinkPlastic: ''
  }),
  control_items: [
    { verification: 'Raw Material visual/sensory inspection', conform: false, nonConform: false, description: '' },
    { verification: 'Primary packaging', conform: false, nonConform: false, description: '' },
    { verification: 'Secondary packaging', conform: false, nonConform: false, description: '' },
    { verification: 'Finished product general aspect', conform: false, nonConform: false, description: '' },
    { verification: 'Stamping of batch date on label', conform: false, nonConform: false, description: '' },
    { verification: 'Finished product label', conform: false, nonConform: false, description: '' },
    { verification: 'Barcode testing', conform: false, nonConform: false, description: '' },
    { verification: 'Has previous label been removed from production?', conform: false, nonConform: false, description: '' },
    { verification: 'Has country of origin been placed?', conform: false, nonConform: false, description: '' },
    { verification: 'Tamper proof sealing if applicable', conform: false, nonConform: false, description: '' }
  ],
  glass_breakage: {
    occurred: false,
    quantity: ''
  }
};

export const DEFAULT_VOLUME_CONTROL_STATE: VolumeControlFormData = {
  productReleaseOrder: '',
  date: '',
  productReference: '',
  quantityProduced: '',
  descriptionOfProduct: '',
  lotNumber: '',
  client: '',
  alcoholContent: '',
  acceptableWeightRange: '',
  measuringCylinders: [
    { 
      type: 'PYREX CYLINDER', 
      ml100: '', 
      ml250: '', 
      ml1000: '', 
      maxPermissibleError: '100ML ± 1ML', 
      conforming: '' 
    },
    { 
      type: 'EX 20 ML CYLINDER', 
      ml100: '', 
      ml250: '', 
      ml1000: '', 
      maxPermissibleError: '250ML ± 2ML', 
      conforming: '' 
    },
    { 
      type: 'LASANY 1000ML CYLINDER', 
      ml100: '', 
      ml250: '', 
      ml1000: '', 
      maxPermissibleError: '1000ML ± 2ML', 
      conforming: '' 
    }
  ],
  cylinderNonConforming: false,
  weightMeasurements: Array(15).fill({
    time: '',
    weights: Array(6).fill(''),
    average: '',
    conforming: ''
  }),
  checkedBy: '',
  checkedDate: '',
  verifiedBy: '',
  verifiedDate: ''
};

// Production Release Types
export interface Sample {
  [key: `sample${number}`]: string | number;
  average: string | number;
  deviation: string;
  correctiveAction: string;
}

export interface ProductionReleaseFormData {
  productionReleaseOrder: string;
  productionDate: string;
  evaluationDate: string;
  lotNumber: string;
  productCode: string;
  samples: Sample[];
  canRelease: boolean;
  elaboratedBy: string;
  elaboratedDate: string;
  approvedBy: string;
  approvedDate: string;
}

export const DEFAULT_PRODUCTION_RELEASE_STATE: ProductionReleaseFormData = {
  productionReleaseOrder: "",
  productionDate: "",
  evaluationDate: "",
  lotNumber: "",
  productCode: "",
  samples: Array(8).fill(null).map(() => ({
    sample1: "",
    sample2: "",
    sample3: "",
    sample4: "",
    average: "",
    deviation: "",
    correctiveAction: ""
  })),
  canRelease: false,
  elaboratedBy: "",
  elaboratedDate: "",
  approvedBy: "",
  approvedDate: ""
};

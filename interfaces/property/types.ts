import { UseFormReturn } from 'react-hook-form';
import { CreatePropertyDTO, Plan } from './PropertyInterface';

export interface FormStepProps extends UseFormReturn<CreatePropertyDTO> {
  nextStep: () => void;
  prevStep: () => void;
  onSubmit: () => Promise<any>;
  isFirstStep: boolean;
  isLastStep: boolean;
  onStepPress?: (stepNumber: number) => void;
  // Optional props provided by shared hooks
  isSubmitting?: boolean;
  plans?: Plan[];
  loadingPlans?: boolean;
  loadPlans?: () => Promise<void>;
}
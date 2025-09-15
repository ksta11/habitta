import { UseFormReturn } from 'react-hook-form';
import { CreatePropertyDTO } from './PropertyInterface';

export interface FormStepProps extends UseFormReturn<CreatePropertyDTO> {
  nextStep: () => void;
  prevStep: () => void;
  onSubmit: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}
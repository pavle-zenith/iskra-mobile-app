import type { StepId } from '@/lib/onboarding/steps';

import {
  CigarettesStep,
  DateStep,
  FearsStep,
  GenderStep,
  NameStep,
  PriceStep,
  ProductStep,
  ReasonTextStep,
  ReasonsStep,
  TimingStep,
  TriggersStep,
} from './questions';
import { CostStep, FearReflectionStep, PreviewStep, ReflectionStep } from './aha';
import {
  CommitmentStep,
  NotificationsStep,
  PanicStep,
  ProcessingStep,
  SummaryStep,
} from './ceremony';

/** Every step of the flow, by id. The route renders whichever one the URL names. */
export const STEP_SCREENS: Record<StepId, () => React.ReactElement> = {
  name: NameStep,
  gender: GenderStep,
  product: ProductStep,
  cigarettes: CigarettesStep,
  price: PriceStep,
  cost: CostStep,
  panic: PanicStep,
  reasons: ReasonsStep,
  reasonText: ReasonTextStep,
  reflection: ReflectionStep,
  fears: FearsStep,
  fearReflection: FearReflectionStep,
  triggers: TriggersStep,
  timing: TimingStep,
  date: DateStep,
  preview: PreviewStep,
  commitment: CommitmentStep,
  processing: ProcessingStep,
  summary: SummaryStep,
  notifications: NotificationsStep,
};

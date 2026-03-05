// Auto-generated index for iteration components
// This file maps iteration filenames to their components

import { ComponentType } from 'react';
import FillInTheBlankIteration1 from './FillInTheBlank.iteration-1';
import FillInTheBlankIteration2 from './FillInTheBlank.iteration-2';
import FillInTheBlankIteration3 from './FillInTheBlank.iteration-3';
import FillInTheBlankIteration4 from './FillInTheBlank.iteration-4';
import ShortAnswerIteration1 from './ShortAnswer.iteration-1';
import ShortAnswerIteration2 from './ShortAnswer.iteration-2';
import ShortAnswerIteration3 from './ShortAnswer.iteration-3';
import ShortAnswerIteration4 from './ShortAnswer.iteration-4';

// Map of filename to component
export const iterationComponents: Record<string, ComponentType<unknown>> = {
  'FillInTheBlank.iteration-1.tsx': FillInTheBlankIteration1 as ComponentType<unknown>,
  'FillInTheBlank.iteration-2.tsx': FillInTheBlankIteration2 as ComponentType<unknown>,
  'FillInTheBlank.iteration-3.tsx': FillInTheBlankIteration3 as ComponentType<unknown>,
  'FillInTheBlank.iteration-4.tsx': FillInTheBlankIteration4 as ComponentType<unknown>,
  'ShortAnswer.iteration-1.tsx': ShortAnswerIteration1 as ComponentType<unknown>,
  'ShortAnswer.iteration-2.tsx': ShortAnswerIteration2 as ComponentType<unknown>,
  'ShortAnswer.iteration-3.tsx': ShortAnswerIteration3 as ComponentType<unknown>,
  'ShortAnswer.iteration-4.tsx': ShortAnswerIteration4 as ComponentType<unknown>,
};

export function getIterationComponent(filename: string): ComponentType<unknown> | undefined {
  return iterationComponents[filename];
}

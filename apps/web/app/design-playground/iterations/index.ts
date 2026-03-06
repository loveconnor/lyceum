// Auto-generated index for iteration components
// This file maps iteration filenames to their components

import { ComponentType } from 'react';

// Import all FillInTheBlank iterations
import FillInTheBlankIteration1 from './FillInTheBlank.iteration-1';
import FillInTheBlankIteration2 from './FillInTheBlank.iteration-2';
import FillInTheBlankIteration3 from './FillInTheBlank.iteration-3';
import FillInTheBlankIteration4 from './FillInTheBlank.iteration-4';

// Map of filename to component
export const iterationComponents: Record<string, ComponentType<any>> = {
  'FillInTheBlank.iteration-1.tsx': FillInTheBlankIteration1 as ComponentType<any>,
  'FillInTheBlank.iteration-2.tsx': FillInTheBlankIteration2 as ComponentType<any>,
  'FillInTheBlank.iteration-3.tsx': FillInTheBlankIteration3 as ComponentType<any>,
  'FillInTheBlank.iteration-4.tsx': FillInTheBlankIteration4 as ComponentType<any>,
};

export function getIterationComponent(filename: string): ComponentType<any> | undefined {
  return iterationComponents[filename];
}

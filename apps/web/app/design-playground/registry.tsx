import { ComponentType } from 'react';
import type { ComponentSize } from './lib/constants';
import { LabLearningWidget } from '../../components/labs/lab-learning-widget';
import {
  formatChildrenSection,
  formatCustomInstructionsSection,
  formatSkillSection,
} from './prompts/utility';
import { iterationPrompt } from './prompts/iteration.prompt';
import { iterationFromIterationPrompt } from './prompts/iteration-from-iteration.prompt';
import { adoptIterationPrompt } from './prompts/adopt.prompt';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RegistryGroupItem {
  id: string;
  label: string;
  children: RegistryItem[];
}

// Re-export ComponentSize from constants for backward compatibility
export type { ComponentSize } from './lib/constants';

export interface RegistryLeafItem {
  id: string;
  label: string;
  Component: ComponentType<Record<string, unknown>>;
  props?: Record<string, unknown>;
  getProps?: () => Promise<Record<string, unknown>> | Record<string, unknown>;
  // Iteration metadata
  sourcePath: string;
  propsInterface: string;
  children?: string[]; // Child component names that can be iterated
  size?: ComponentSize; // Display size for the component preview
}

export type RegistryItem = RegistryGroupItem | RegistryLeafItem;

export function isGroup(item: RegistryItem): item is RegistryGroupItem {
  return 'children' in item && !('Component' in item);
}

export function isLeaf(item: RegistryItem): item is RegistryLeafItem {
  return 'Component' in item;
}

function createLearningPreview(
  widgetType: string,
  widgetKey: string,
): ComponentType<Record<string, unknown>> {
  return function LearningPreview(config: Record<string, unknown>) {
    return (
      <LabLearningWidget
        widgetType={widgetType}
        widgetKey={widgetKey}
        config={config}
      />
    );
  };
}

// ---------------------------------------------------------------------------
// Registry tree
// ---------------------------------------------------------------------------

export const registry: RegistryItem[] = [
  {
    id: 'learning-components',
    label: 'Learning Components',
    children: [
      {
        id: 'short-answer',
        label: 'Short Answer',
        Component: createLearningPreview('ShortAnswer', 'short-answer-preview'),
        props: {
          label: 'Short Answer',
          question: 'What is the main purpose of React hooks?',
          placeholder: 'Type your response...',
          maxLength: 250,
          rows: 4,
        },
        sourcePath: 'apps/web/components/learning/ShortAnswer.tsx',
        propsInterface: `type ShortAnswerProps = {
  label?: string;
  question?: string;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}`,
      },
      {
        id: 'multiple-choice',
        label: 'Multiple Choice',
        Component: createLearningPreview('MultipleChoice', 'multiple-choice-preview'),
        props: {
          question: 'Which hook is used for component state?',
          options: [
            { id: 'a', label: 'useState' },
            { id: 'b', label: 'useRouter' },
            { id: 'c', label: 'useMemoizedValue' },
          ],
          correctOptionId: 'a',
          showFeedback: true,
        },
        sourcePath: 'apps/web/components/learning/MultipleChoice.tsx',
        propsInterface: `type MultipleChoiceProps = {
  question: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
  showFeedback?: boolean;
}`,
      },
      {
        id: 'true-false',
        label: 'True False',
        Component: createLearningPreview('TrueFalse', 'true-false-preview'),
        props: {
          statement: 'TypeScript catches many runtime bugs at compile time.',
          correctAnswer: true,
          explanation: 'Type checks move many classes of errors earlier into development.',
        },
        sourcePath: 'apps/web/components/learning/TrueFalse.tsx',
        propsInterface: `type TrueFalseProps = {
  statement: string;
  correctAnswer: boolean;
  explanation?: string;
}`,
      },
      {
        id: 'fill-in-the-blank',
        label: 'Fill In The Blank',
        Component: createLearningPreview('FillInTheBlank', 'fill-in-the-blank-preview'),
        props: {
          title: 'Complete the sentence',
          textTemplate: 'React components should be {{adjective}} and easy to {{verb}}.',
          blanks: [
            { id: 'adjective', correctAnswers: ['reusable'] },
            { id: 'verb', correctAnswers: ['test'] },
          ],
          wordBank: ['reusable', 'mutable', 'test', 'guess'],
        },
        sourcePath: 'apps/web/components/learning/FillInTheBlank.tsx',
        propsInterface: `type FillInTheBlankProps = {
  textTemplate: string;
  blanks: { id: string; correctAnswers: string[] }[];
  wordBank?: string[];
}`,
      },
      {
        id: 'order-steps',
        label: 'Order Steps',
        Component: createLearningPreview('OrderSteps', 'order-steps-preview'),
        props: {
          title: 'Deploy Flow',
          items: [
            { id: 'write', label: 'Write the feature code' },
            { id: 'test', label: 'Run tests locally' },
            { id: 'review', label: 'Open a pull request' },
            { id: 'deploy', label: 'Merge and deploy' },
          ],
          correctOrder: ['write', 'test', 'review', 'deploy'],
        },
        sourcePath: 'apps/web/components/learning/OrderSteps.tsx',
        propsInterface: `type OrderStepsProps = {
  items: { id: string; label: string }[];
  correctOrder?: string[];
}`,
      },
      {
        id: 'drag-drop',
        label: 'Drag Drop',
        Component: createLearningPreview('DragDrop', 'drag-drop-preview'),
        props: {
          title: 'Categorize Concepts',
          categories: [
            { id: 'frontend', label: 'Frontend' },
            { id: 'backend', label: 'Backend' },
          ],
          items: [
            { id: 'react', label: 'React', correctCategoryId: 'frontend' },
            { id: 'next-api', label: 'API Route', correctCategoryId: 'backend' },
            { id: 'css', label: 'CSS', correctCategoryId: 'frontend' },
          ],
        },
        sourcePath: 'apps/web/components/learning/DragDrop.tsx',
        propsInterface: `type DragDropProps = {
  categories: { id: string; label: string }[];
  items: { id: string; label: string; correctCategoryId?: string }[];
}`,
      },
      {
        id: 'numeric-input',
        label: 'Numeric Input',
        Component: createLearningPreview('NumericInput', 'numeric-input-preview'),
        props: {
          label: 'What is 9 + 3?',
          placeholder: 'Enter a number',
          correctAnswer: 12,
          tolerance: 0,
        },
        sourcePath: 'apps/web/components/learning/NumericInput.tsx',
        propsInterface: `type NumericInputProps = {
  label?: string;
  correctAnswer: number;
  tolerance?: number;
  placeholder?: string;
}`,
      },
      {
        id: 'matching',
        label: 'Matching',
        Component: createLearningPreview('Matching', 'matching-preview'),
        props: {
          title: 'Match Terms',
          leftItems: [
            { id: 'jsx', label: 'JSX' },
            { id: 'props', label: 'Props' },
            { id: 'state', label: 'State' },
          ],
          rightItems: [
            { id: 'jsx', label: 'UI syntax in JS' },
            { id: 'props', label: 'Inputs passed to component' },
            { id: 'state', label: 'Component-local data' },
          ],
        },
        sourcePath: 'apps/web/components/learning/Matching.tsx',
        size: 'laptop' as ComponentSize,
        propsInterface: `type MatchingProps = {
  leftItems: { id: string; label: string }[];
  rightItems: { id: string; label: string }[];
}`,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Flatten helper
// ---------------------------------------------------------------------------

export function flattenRegistry(
  items: RegistryItem[],
  result: Record<string, RegistryLeafItem> = {}
): Record<string, RegistryLeafItem> {
  for (const item of items) {
    if (isLeaf(item)) {
      result[item.id] = item;
    } else if (isGroup(item)) {
      flattenRegistry(item.children, result);
    }
  }
  return result;
}

export const flatRegistry = flattenRegistry(registry);

// ---------------------------------------------------------------------------
// Prompt generator
// ---------------------------------------------------------------------------

export function generateIterationPrompt(
  componentId: string,
  iterationCount: number = 4,
  depth: 'shell' | '1-level' | 'all' = 'shell',
  customInstructions?: string,
  skillPrompt?: string,
): string {
  const item = flatRegistry[componentId];
  if (!item) return '';

  const componentName = item.label.replace(/\s*\(.*\)/, '');
  const cleanComponentName = componentName.replace(/\s+/g, '');
  const depthLabel = depth === 'shell' ? 'Shell only' : depth === '1-level' ? '1 level deep' : 'All levels';

  const childrenSection = formatChildrenSection(item.children);
  const customInstructionsSection = formatCustomInstructionsSection(customInstructions);
  const skillSection = formatSkillSection(skillPrompt);

  return iterationPrompt({
    skillSection,
    componentName,
    sourcePath: item.sourcePath,
    iterationCount: String(iterationCount),
    depthLabel,
    childrenSection,
    propsInterface: item.propsInterface,
    cleanComponentName,
    componentId,
    customInstructionsSection,
  });
}

// ---------------------------------------------------------------------------
// Iteration-from-iteration prompt generator
// ---------------------------------------------------------------------------

export function generateIterationFromIterationPrompt(
  componentId: string,
  sourceIterationFilename: string,
  iterationCount: number,
  startNumber: number,
  depth: 'shell' | '1-level' | 'all' = 'shell',
  customInstructions?: string,
  skillPrompt?: string,
): string {
  const item = flatRegistry[componentId];
  if (!item) return '';

  const componentName = item.label.replace(/\s*\(.*\)/, '');
  const cleanComponentName = componentName.replace(/\s+/g, '');
  const depthLabel = depth === 'shell' ? 'Shell only' : depth === '1-level' ? '1 level deep' : 'All levels';
  const endNumber = startNumber + iterationCount - 1;
  const iterationSourcePath = `app/design-playground/iterations/${sourceIterationFilename}`;

  const childrenSection = formatChildrenSection(item.children);
  const customInstructionsSection = formatCustomInstructionsSection(customInstructions);
  const skillSection = formatSkillSection(skillPrompt);

  const iterationNumbers = Array.from(
    { length: iterationCount },
    (_, i) => startNumber + i,
  );

  const iterationSavesBlock = iterationNumbers
    .map((n) => `   - Save as app/design-playground/iterations/${cleanComponentName}.iteration-${n}.tsx`)
    .join('\n');

  return iterationFromIterationPrompt({
    skillSection,
    componentName,
    sourcePath: item.sourcePath,
    iterationSourcePath,
    iterationCount: String(iterationCount),
    startNumber: String(startNumber),
    endNumber: String(endNumber),
    depthLabel,
    childrenSection,
    propsInterface: item.propsInterface,
    iterationSavesBlock,
    treeParent: sourceIterationFilename,
    customInstructionsSection,
    iterationNumbersList: iterationNumbers.join(', '),
    sourceIterationFilename,
  });
}

// ---------------------------------------------------------------------------
// Adopt prompt generator
// ---------------------------------------------------------------------------

export function generateAdoptPrompt(
  componentId: string,
  iterationFilename: string
): string {
  const item = flatRegistry[componentId];
  const originalPath = item?.sourcePath || `src/components/${iterationFilename.split('.iteration')[0]}.tsx`;
  const iterationPath = `app/design-playground/iterations/${iterationFilename}`;

  return adoptIterationPrompt({ originalPath, iterationPath });
}
